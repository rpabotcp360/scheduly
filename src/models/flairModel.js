const { sql, connectDB } = require('../db_universal');

const getFlairAirlinesData = async (updatedDate) => {
    try {
        let pool = await connectDB();
        const query = `
            WITH AggregatedData AS (
    SELECT 
        a.[Updated Date] AS Date,
        b.H2R_Name AS Name, 
        a.[High Level Ticket Channel],
        a.[Ticket satisfaction rating],
        CASE WHEN a.[High Level Ticket Channel] = 'Email' THEN 1 ELSE 0 END AS EmailHandled,
        
        CASE WHEN a.[High Level Ticket Channel] = 'Social DM' THEN 1 ELSE 0 END AS SocialHandled,
        CASE WHEN a.[High Level Ticket Channel] = 'Ada Chat' THEN 1 ELSE 0 END AS ChatsHandled,
        CASE WHEN a.[Ticket satisfaction rating] = 'Bad' THEN 1 ELSE 0 END AS NegativeCSAT,
        CASE WHEN a.[Ticket satisfaction rating] = 'Good' THEN 1 ELSE 0 END AS PositiveCSAT
    FROM 
        flair.Zendesk_Productivity AS a
    LEFT JOIN 
        flair.Mapping AS b ON a.[Updater email] = b.[Zendesk Name]
),

AgentPerformance AS (
    SELECT 
        d.[Date],
        e.[H2R_Name] AS Name, 
        SUM(d.[Contacts handled]) AS VoiceCall
    FROM 
        [flair].[AWS_AgentPerformance] d
    LEFT JOIN 
        [flair].[Mapping] e ON d.[Agent] = e.[Zendesk Name]
    GROUP BY 
        d.[Date], e.[H2R_Name]
)

SELECT 
    a.Date, 
    a.Name,
    COALESCE(SUM(a.EmailHandled), 0) AS [Email Handled],
	COALESCE(p.VoiceCall, 0) AS VoiceCall,
    COALESCE(SUM(a.SocialHandled), 0) AS [Social Handled], 
    COALESCE(SUM(a.ChatsHandled), 0) AS [Chats Handled],
    COALESCE(SUM(a.NegativeCSAT), 0) AS [Negative CSAT], 
    COALESCE(SUM(a.PositiveCSAT), 0) AS [Positive CSAT],
    COALESCE(SUM(a.NegativeCSAT + a.PositiveCSAT), 0) AS TotalSurveys
FROM 
    AggregatedData a
LEFT JOIN 
    AgentPerformance p 
    ON a.Date = p.Date AND a.Name = p.Name
WHERE a.Name IS NOT NULL AND a.Date = @updatedDate
GROUP BY 
    a.Date, a.Name, p.VoiceCall    
        `;
        const result = await pool.request()
            .input('updatedDate', sql.Date, updatedDate)
            .query(query);

        return result.recordset;
    } catch (error) {
        console.error("❌ Error fetching Flair Airlines data:", error.message);
        throw error;
    }
};

module.exports = { getFlairAirlinesData };
