const StatCard = ({
    title,
    value,
    }) => {
    return (
        <div className="rounded-2xl p-6 shadow-sm border bg-slate-900 border-slate-800 text-white backdrop-blur">


        <div className="text-white text-sm">
            {title}
        </div>

        <div className="text-4xl font-bold mt-3 text-white">
            {value}
        </div>

        </div>
    );
};

export default StatCard;