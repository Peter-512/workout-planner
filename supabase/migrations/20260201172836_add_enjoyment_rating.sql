alter table "public"."workout"
    add column "rating" smallint;

alter table "public"."workout"
    add constraint "workout_rating_range"
        check ("rating" is null or ("rating" >= 1 and "rating" <= 5));
