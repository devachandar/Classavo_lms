import StatCard from "./StatCard";

const DashboardStats = ({
    stats,
    }) => {
    return (
        <div className="grid md:grid-cols-3 gap-6">

        <StatCard
            title="Total Courses"
            value={stats.total_courses}
        />

        <StatCard
            title="Students Enrolled"
            value={stats.total_students}
        />

        <StatCard
            title="Total Chapters"
            value={stats.total_chapters}
        />

        </div>
    );
};

export default DashboardStats;