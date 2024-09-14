import Builder from "@/components/shared/builder/Builder";
import { Header } from "../components/shared/header/Header";
import { Sidebar } from "../components/shared/sidebar/Sidebar";

const MainPage = () => {
  return (
    <>
      <Header />
      <section className="flex flex-row min-w-[1024px] h-[calc(100vh-60px)]">
        <div className="min-w-[800px] w-full">
          <Builder />
        </div>
        <Sidebar />
      </section>
    </>
  );
};

export default MainPage;
