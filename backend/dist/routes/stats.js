"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get statistics data
router.get('/', auth_1.authenticateUser, async (req, res) => {
    try {
        // Get total clients count
        const totalClients = await prisma.clientIntake.count();
        // Get tax clients count (Direct Tax + Indirect Tax)
        const taxClients = await prisma.clientIntake.count({
            where: {
                OR: [
                    { servicesSelected: { has: 'Direct Tax' } },
                    { servicesSelected: { has: 'Indirect Tax' } }
                ]
            }
        });
        // Get service breakdown
        const allClients = await prisma.clientIntake.findMany({
            select: { servicesSelected: true }
        });
        const serviceCounts = {};
        allClients.forEach(client => {
            client.servicesSelected.forEach(service => {
                serviceCounts[service] = (serviceCounts[service] || 0) + 1;
            });
        });
        const serviceBreakdown = Object.entries(serviceCounts).map(([service, count]) => ({
            service,
            count
        }));
        // Get priority distribution
        const priorityDistribution = await prisma.clientIntake.groupBy({
            by: ['clientPriority'],
            _count: {
                clientPriority: true
            }
        });
        const priorityData = priorityDistribution.map(item => ({
            priority: item.clientPriority || 'N/A',
            count: item._count.clientPriority
        }));
        // Get RAMIS status breakdown
        const ramisStatusBreakdown = await prisma.clientIntake.groupBy({
            by: ['ramisStatus'],
            _count: {
                ramisStatus: true
            }
        });
        const ramisData = ramisStatusBreakdown.map(item => ({
            status: item.ramisStatus,
            count: item._count.ramisStatus
        }));
        // Get recent clients (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentClients = await prisma.clientIntake.count({
            where: {
                submittedAt: {
                    gte: sevenDaysAgo
                }
            }
        });
        // Get direct tax count
        const directTaxCount = await prisma.clientIntake.count({
            where: {
                servicesSelected: { has: 'Direct Tax' }
            }
        });
        // Get indirect tax count
        const indirectTaxCount = await prisma.clientIntake.count({
            where: {
                servicesSelected: { has: 'Indirect Tax' }
            }
        });
        const statistics = {
            totalClients,
            taxClients,
            serviceBreakdown,
            priorityDistribution: priorityData,
            ramisStatusBreakdown: ramisData,
            recentClients,
            directTaxCount,
            indirectTaxCount
        };
        res.json({
            success: true,
            data: statistics
        });
    }
    catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});
exports.default = router;
//# sourceMappingURL=stats.js.map