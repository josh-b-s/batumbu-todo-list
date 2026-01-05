import * as React from "react";
import dayjs, {Dayjs} from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";

interface DueDatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    disabled?: boolean;
}

export default function DueDatePicker({
                                          value,
                                          onChange,
                                          disabled = false,
                                      }: DueDatePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                disablePast
                value={value ? dayjs(value) : null}
                onChange={(newValue: Dayjs | null) => {
                    onChange(newValue ? newValue.toDate() : null);
                }}
                disabled={disabled}
                sx={{
                    "&:where([data-theme=Dark], [data-theme=Dark] *) .MuiSvgIcon-root": {
                        color: "var(--color-white)",
                    },

                    "& .MuiPickersOutlinedInput-notchedOutline": {
                        borderColor: "#6b7280 !important",
                    },
                    "& .Mui-disabled *": {
                        color: "#6b7280 !important",
                    },
                }}
                slotProps={{
                    popper: {
                        placement: "bottom-start",
                        modifiers: [
                            {
                                name: "flip",
                                enabled: false,
                            },
                        ],
                        sx: {
                            "& .MuiPickersArrowSwitcher-button": {
                                color: "inherit",
                            },

                            "& .MuiPickersArrowSwitcher-button:hover": {
                                backgroundColor: "rgba(107, 114, 128,0.25)",
                            },

                            "&:where([data-theme=Dark], [data-theme=Dark] *) .MuiPickersCalendarHeader-switchViewButton": {
                                color: "rgba(255,255,255,1)",
                            },

                            "& .MuiPickersDay-root:not(.Mui-selected):hover": {
                                backgroundColor: "rgba(107, 114, 128,0.25)",
                            },

                            "& .MuiPickersLayout-contentWrapper": {
                                paddingBottom: 1,
                            },

                            "& ::-webkit-scrollbar": {
                                width: 8,
                            },

                            "& ::-webkit-scrollbar-track": {
                                background: "transparent",
                            },

                            "& ::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(107, 114, 128,1)",
                                borderRadius: 8,
                            },

                            "& .MuiPaper-root": {
                                borderRadius: "20px",
                                backgroundColor: "#ffffff",
                                color: "#000000",
                                overflow: "hidden"
                            },

                            "&:where([data-theme=Dark], [data-theme=Dark] *) .MuiPaper-root": {
                                backgroundColor: "var(--color-dark, #1f2937)",
                                color: "var(--color-white, #ffffff)",
                            },

                            // calendar days inherit text color
                            "& .MuiPickersDay-root": {
                                color: "inherit",
                                border: "0"
                            },

                            // weekday labels inherit text color
                            "& .MuiDayCalendar-weekDayLabel": {
                                color: "inherit",
                            },

                            // selected day styling
                            "& .MuiPickersDay-root.Mui-selected": {
                                backgroundColor: "var(--color-primary, #2563eb)",
                                color: "#ffffff",
                            },

                            "& .MuiPickersDay-root.Mui-selected:hover": {
                                backgroundColor: "var(--color-primary-dark, #1d4ed8)",
                            },

                            "& .Mui-disabled": {
                                color: "#6b7280 !important",
                                opacity: 0.5
                            },
                        },
                    },

                    field: {
                        clearable: true,
                    },
                    textField: {
                        fullWidth: true,
                        InputProps: {
                            sx: {borderRadius: "15px", color: "inherit"},
                        },
                    },
                    openPickerIcon: {
                        sx: {
                            display: disabled ? "none" : "block",
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}
