import Dropzone from "@/features/dashboard/components/Dropzone";
import Header from "@/features/dashboard/components/Header";
import NavSide from "@/features/dashboard/components/NavSide";
import RecentFilesList from "@/features/dashboard/components/RecentFilesList";
import StorageWrapper from "@/features/dashboard/components/StorageWrapper";

const page = () => {
  return (
    <main className="flex md:max-h-screen overflow-hidden">
      <NavSide />
      <div className="w-full md:pr-[40px] flex flex-col items-center md:px-0">
        <Header parentId={null} />
        <div className="flex flex-col lg:flex-row gap-[20px] bg-[#F2F4F8] flex-1 p-[20px] rounded-[30px] overflow-y-scroll scroll-hidden w-full lg:mb-[20px] relative xl:pl-0">
          <Dropzone parentId={null} />

          <div className="w-full flex-1 flex flex-col gap-[20px] lg:max-w-[482px]">
            <StorageWrapper />
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
