import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "../../utils/Cn";
import { buttonVariants } from "../Button/Button";

function CustomPrevButton(props: any) {
  return (
    <button
      {...props}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      )}
    >
      <ChevronLeft className="size-4" />
    </button>
  );
}

function CustomNextButton(props: any) {
  return (
    <button
      {...props}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      )}
    >
      <ChevronRight className="size-4" />
    </button>
  );
}

function CustomNav(props: any) {
  return (
    <div className="flex items-center relative">
      <CustomPrevButton {...props} />
      <CustomNextButton {...props} />
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4 w-full",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        table: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ), // antigo day_button
        disabled: "text-muted-foreground opacity-50",
        outside: "text-muted-foreground aria-selected:text-muted-foreground",
        today: "bg-accent text-accent-foreground",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", // antigo day_selected
        range_start:
          "aria-selected:bg-primary aria-selected:text-primary-foreground",
        range_end:
          "aria-selected:bg-primary aria-selected:text-primary-foreground",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        PreviousMonthButton: CustomPrevButton,
        NextMonthButton: CustomNextButton,
        Nav: CustomNav,
      }}
      {...props}
    />
  );
}

export { Calendar };
