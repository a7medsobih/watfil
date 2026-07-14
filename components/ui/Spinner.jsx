// components/ui/Spinner.jsx

export default function Spinner() {
    return (
        <div className="flex items-center justify-center h-[50vh] py-10">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
        </div>
    );
}