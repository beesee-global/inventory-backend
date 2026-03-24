const BaseModel = require("../base.js");
const ApiError = require("../apiError.js");
const { v4: uuidv4 } = require('uuid');

class DashboardModel extends BaseModel {
    constructor (fastify) {
        super(
            fastify,
            "faqs",
            "id",
            []
        );
    }

    async getStatsCategory () {
        let sql = `
            SELECT 
                c.name AS category_name,
                COUNT(t.id) AS ticket_count
            FROM categories c
            LEFT JOIN tickets t 
                ON t.categories_id = c.id
            GROUP BY c.id, c.name
            ORDER BY ticket_count DESC;
        `

        const value = [];
        const result = await this.mysql("query", null, sql, value)
       
        return {
             data: {
                success: true,
                message: "Stats retrieved successfully",
                data: { 
                    ticketCounts: result
                }
             }
        }
    }

    async getStatsDevice () {
        let sql = `
            SELECT 
                p.name AS product_name,
                COUNT(t.id) AS ticket_count
            FROM products p
            LEFT JOIN tickets t
                ON t.products_id = p.id
            GROUP BY p.id, p.name
            ORDER BY ticket_count DESC;
        `

        const value = [];
        const result = await this.mysql("query", null, sql, value);

        return {
            data: {
                success: true,
                message: "Stats retrieved successfully",
                data: { 
                    ticketCounts: result
                }
            }
        }
    }

    async getOverview () {
        let sql = `
            SELECT  
                t.status,
                COUNT(*) As total
            FROM customers c
            LEFT JOIN tickets t
                ON t.customers_id = c.id
            GROUP BY t.status;
        `

        let value = [];
        const result = await this.mysql("query", null, sql, value)
        
        const rows = result
        
        const categories = [];
        const openCounts = [];
        const resolvedCounts = [];

        const groups = {};

        rows.forEach(row => {
             // 🔥 Rename School → Client
            const org = row.organization_type === "School" ? "Client" : "RFGS";

            if (!groups[org]) {
                groups[org] = { open: 0, resolved: 0 };
            }

            if (row.status === "open") {
                groups[org].open = row.total;
            } 
            else if (row.status === "resolved") {
                groups[org].resolved = row.total;
            }
        });

        for (let org in groups) {
            categories.push(org);
            openCounts.push(groups[org].open);
            resolvedCounts.push(groups[org].resolved);
        }

        const chartData = {
            categories,
            series: [
                { name: "Pending", data: openCounts },
                { name: "Completed", data: resolvedCounts}
            ]
        }

        return {
            data: {
                success: true,
                message: "Overview retrieved successfully",
                data: chartData
            }
        }
    }
    
    async getCountStatus () {
        try {
            let sql = `
            SELECT
                SUM(CASE WHEN status = 'open' AND created_at IS NOT NULL THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'ongoing' AND created_at IS NOT NULL THEN 1 ELSE 0 END) AS ongoing,
                SUM(CASE WHEN status = 'resolved' AND updated_at IS NOT NULL THEN 1 ELSE 0 END) AS completed
            FROM tickets
            `

            const result = await this.mysql("query", null, sql, []);

            return {
                data:{
                    success: true,
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async getCountMostlyIssue () {
        try {
            const allCategoriesSql = `
                SELECT
                    c.id,
                    c.pid,
                    c.name,
                    c.is_active,
                    c.created_at,
                    c.updated_at
                FROM categories c 
                WHERE is_active = 'false'
                ORDER BY c.name ASC
            `;

            const mostlyIssuedSql = `
                SELECT
                    c.id AS categories_id,
                    c.name AS category_name,
                    i.id AS issues_id,
                    i.name AS issue_name,
                    COUNT(t.id) AS total_reported
                FROM categories c
                LEFT JOIN tickets t
                    ON c.id = t.categories_id
                LEFT JOIN issues i
                    ON i.id = t.issues_id
                GROUP BY i.id, i.name, c.id, c.name
                ORDER BY c.name ASC, total_reported DESC, i.name ASC
            `;

            const allCategories = await this.mysql("query", null, allCategoriesSql, []);
            const reportedIssues = await this.mysql("query", null, mostlyIssuedSql, []);

            const top5MostlyIssued = allCategories.map((category) => {
                const issues = reportedIssues
                    .filter((row) => row.categories_id === category.id && row.issues_id !== null)
                    .slice(0, 5)
                    .map((row) => ({
                        issues_id: row.issues_id,
                        issue_name: row.issue_name,
                        total_reported: row.total_reported
                    }));

                return {
                    categories_id: category.id,
                    category_name: category.name,
                    issues
                };
            });

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: { 
                        top5MostlyIssued
                    }
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }

    async getCountStatusByMonth () {
        try {
            const sql = `
                SELECT
                    month_number,
                    SUM(open_count) AS open_count,
                    SUM(ongoing_count) AS ongoing_count,
                    SUM(resolved_count) AS resolved_count
                FROM (
                    SELECT
                        MONTH(created_at) AS month_number,
                        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_count,
                        SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) AS ongoing_count,
                        0 AS resolved_count
                    FROM tickets
                    WHERE created_at IS NOT NULL
                    GROUP BY MONTH(created_at)

                    UNION ALL

                    SELECT
                        MONTH(updated_at) AS month_number,
                        0 AS open_count,
                        0 AS ongoing_count,
                        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_count
                    FROM tickets
                    WHERE updated_at IS NOT NULL
                    GROUP BY MONTH(updated_at)
                ) monthly_status
                GROUP BY month_number
                ORDER BY month_number ASC
            `;

            const result = await this.mysql("query", null, sql, []);

            const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];

            const openData = new Array(12).fill(0);
            const ongoingData = new Array(12).fill(0);
            const resolvedData = new Array(12).fill(0);

            result.forEach((row) => {
                const idx = Number(row.month_number) - 1;
                if (idx >= 0 && idx < 12) {
                    openData[idx] = Number(row.open_count) || 0;
                    ongoingData[idx] = Number(row.ongoing_count) || 0;
                    resolvedData[idx] = Number(row.resolved_count) || 0;
                }
            });

            return {
                data: {
                    success: true,
                    message: "Retrieved successfully",
                    data: {
                        categories: months,
                        series: [
                            { name: "Pending", data: openData },
                            { name: "Ongoing", data: ongoingData },
                            { name: "Completed", data: resolvedData }
                        ]
                    }
                }
            }

        } catch (error) {
            throw new ApiError(error, 400)
        }
    } 

    async getCountNewApplicants () {
        try {
            let sql = `
                SELECT 
                    SUM(CASE WHEN status = 'NEW_APPLICANT' THEN 1 ELSE 0 END) AS new_applicant
                FROM applicants
            `

            const result = await this.mysql("query", null, sql, []);

            return {
                data: {
                    success: true,
                    data: result
                }
            }
        } catch (error) {
            throw new ApiError(error, 400)
        }
    }
}

module.exports = DashboardModel;



