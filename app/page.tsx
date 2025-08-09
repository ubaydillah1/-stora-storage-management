import Header from "@/features/dashboard/components/Header";
import NavSide from "@/features/dashboard/components/NavSide";
import RecentFilesList from "@/features/dashboard/components/RecentFilesList";
import SizeCard from "@/features/dashboard/components/SizeCard";
import StorageCircleDemo from "@/features/dashboard/components/StorageCircle";

const page = () => {
  return (
    <main className="flex max-h-screen overflow-hidden">
      <NavSide />
      <div className="w-full pr-[40px] flex flex-col">
        <Header />
        <div className="flex flex-col lg:flex-row gap-[20px] bg-[#F2F4F8] flex-1 p-[40px] mb-[40px] rounded-[30px] overflow-y-scroll scroll-hidden">
          <div className="w-full flex-1 flex flex-col gap-[20px] lg:max-w-[482px]">
            <StorageCircleDemo />
            <SizeCard />
          </div>

          <div className="flex-1 p-[20px] bg-white rounded-[20px]">
            <RecentFilesList />
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
