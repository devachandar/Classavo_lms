import PlateEditor from "./PlateEditor";

const ChapterEditor = ({
    chapterForm,
    setChapterForm,
    }) => {

    return (

        <div className="p-6">

        <PlateEditor
            value={
            chapterForm.content
            }
            onChange={(value) =>
            setChapterForm({
                ...chapterForm,
                content: value,
            })
            }
        />

        </div>

    );
};

export default ChapterEditor;