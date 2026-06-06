import ChapterListItem from "./ChapterListItem";

const ChapterSidebar = ({
    chapters,
    selectedChapter,
    setSelectedChapter,
    }) => {
    return (
        <div className="w-80 border-r bg-slate-950
border-slate-800 p-4">

        {/* <h2 className="font-bold text-xl mb-6">
            Chapters
        </h2> */}

        <div className="space-y-3">

            {chapters.map((chapter) => (
            <ChapterListItem
                key={chapter.id}
                chapter={chapter}
                selected={
                selectedChapter?.id === chapter.id
                }
                onSelect={setSelectedChapter}
            />
            ))}

        </div>

        </div>
    );
};

export default ChapterSidebar;