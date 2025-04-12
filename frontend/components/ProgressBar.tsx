interface ProgressBarProps {
    progress: number;
  }
  
  export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
      <div className="w-full flex gap-1">
        <div
          className={`h-2 flex-1 transition-colors duration-500 ${
            progress >= 50 ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`h-2 flex-1 transition-colors duration-500 ${
            progress === 100 ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
      </div>
    );
  }