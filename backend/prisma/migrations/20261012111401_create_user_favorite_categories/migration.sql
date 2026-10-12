-- CreateTable
CREATE TABLE "user_favorite_categories" (
    "user_id" INTEGER NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "user_favorite_categories_pkey" PRIMARY KEY ("user_id","category")
);

-- AddForeignKey
ALTER TABLE "user_favorite_categories" ADD CONSTRAINT "user_favorite_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
