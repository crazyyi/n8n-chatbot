import AIChatBot from "./AIChatBot";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-6 h-full space-y-3">
      <main className="flex flex-col w-1/2">
        <AIChatBot />
      </main>
      <footer className="flex gap-[24px] flex-wrap items-center justify-center">
        <p className="footer">created by Aaron Zeng with &hearts;</p>
      </footer>
    </div>
  );
}
