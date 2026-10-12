-- CreateTable
CREATE TABLE "event_card_designs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_card_designs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_card_designs_event_id_idx" ON "event_card_designs"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_card_designs_user_id_event_id_key" ON "event_card_designs"("user_id", "event_id");

-- AddForeignKey
ALTER TABLE "event_card_designs" ADD CONSTRAINT "event_card_designs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_card_designs" ADD CONSTRAINT "event_card_designs_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
