-- CreateTable
CREATE TABLE "event_card_stickers" (
    "id" SERIAL NOT NULL,
    "design_id" INTEGER NOT NULL,
    "sticker_key" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "event_card_stickers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_card_stickers_design_id_position_key" ON "event_card_stickers"("design_id", "position");

-- AddForeignKey
ALTER TABLE "event_card_stickers" ADD CONSTRAINT "event_card_stickers_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "event_card_designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
