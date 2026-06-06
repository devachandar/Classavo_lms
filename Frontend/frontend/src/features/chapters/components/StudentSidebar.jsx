const StudentSidebar = ({ students }) => {
    return (
        <div className="space-y-3 bg-slate-900 text-white border-slate-800">

        {students.map((student) => (
            <div
            key={student.id}
            className="border rounded-xl p-3"
            >
            <p className="font-medium">
                {student.username}
            </p>

            <p className="text-sm text-slate-500">
                {student.email}
            </p>
            </div>
        ))}

        </div>
    );
};

export default StudentSidebar;