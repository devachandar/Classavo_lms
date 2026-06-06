const ChapterListItem = ({
    chapter,
    selected,
    onSelect,
    }) => {
    return (
        <button
        onClick={() => onSelect(chapter)}
        className={`w-full text-left p-4 rounded-xl border transition ${
            selected
            ? "bg-blue-50 border-blue-500"
            : "bg-white border-slate-200"
        }`}
        >
        <div className="flex justify-between">

            <span>
            {chapter.position}. {chapter.title}
            </span>

            <span
            className={`text-xs px-2 py-1 rounded-full ${
                chapter.status === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
            >
            {chapter.status}
            </span>

        </div>
        </button>
    );
};

export default ChapterListItem;