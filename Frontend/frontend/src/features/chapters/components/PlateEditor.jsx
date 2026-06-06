import {
    Plate,
    PlateContent,
    createPlateEditor,
    } from "@platejs/core/react";

    import { useMemo } from "react";

    import {
    BaseBasicBlocksPlugin,
    BaseBasicMarksPlugin,
    } from "@platejs/basic-nodes";

    const PlateEditor = ({
    value,
    onChange,
    }) => {
        const editor = useMemo(
            () =>
                createPlateEditor({
                    plugins: [
                        BaseBasicBlocksPlugin,
                        BaseBasicMarksPlugin,
                    ],
                }),
            []
        );

    return (

        <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden">

        <div className="px-4 py-3 border-b bg-slate-50">

            <span className="text-sm font-medium text-slate-600">
            Chapter Content
            </span>

        </div>

        <Plate
            editor={editor}
            value={value}
            onChange={(e) => {
            onChange(e.value);
            console.log("plate value:", e.value);
            }}
        >

            <PlateContent
            className="
                min-h-[600px]
                p-6
                outline-none
                prose
                max-w-none
            "
            />

        </Plate>

        </div>

    );
};

export default PlateEditor;