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
                value={value ? dayjs(value) : null}
                onChange={(newValue: Dayjs | null) => {
                    onChange(newValue ? newValue.toDate() : null);
                }}
                disabled={disabled}
                sx={{
                    "& .MuiSvgIcon-root": {
                        color: "inherit",
                    },
                    "&:where([data-theme=Dark], [data-theme=Dark] *) .MuiSvgIcon-root": {
                        color: "var(--color-white)",
                    },

                    "& .MuiPickersOutlinedInput-notchedOutline": {
                        borderColor: "#6b7280 !important",
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
                    },

                    field: {
                        clearable: true,
                    },
                    textField: {
                        fullWidth: true,
                        InputProps: {
                            sx: {borderRadius: '15px', color: 'inherit'},
                        },
                    },
                    openPickerIcon: {
                        sx: {
                            color: 'inherit',
                        },
                    }
                }}
            />
        </LocalizationProvider>
    );
}
