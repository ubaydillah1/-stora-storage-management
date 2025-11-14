export type StorageCategory = {
  size: number;
  count: number;
};

export type StorageSummary = {
  totalUsed: number;
  maxStorage: number;
  categories: {
    document: StorageCategory;
    image: StorageCategory;
    video: StorageCategory;
    audio: StorageCategory;
    other: StorageCategory;
  };
};
