import styled from "@styled";
import type { Size } from "@ui-types";
import { type ChangeEvent, type Ref, useState } from "react";

import {
    resolveIconScaling,
    resolveRadioStyles,
    variantColors,
} from "./Radio.helpers";
import type { RadioProps } from "./Radio.types";

const RadioWrapper = styled("label")<RadioProps>(
    ({ disabled, size = "md" }) => ({
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.3s ease",
        ...(disabled && { opacity: 0.5, pointerEvents: "none" }),
        ...resolveRadioStyles(size),
    }),
);

RadioWrapper.displayName = "RadioWrapper";

const HiddenRadio = styled("input")({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    margin: 0,
    padding: 0,
    opacity: 0,
});

HiddenRadio.displayName = "HiddenRadio";

const RadioControl = styled("span")<RadioProps>(({
    theme,
    color = "primary",
    variant = "plain",
    checked,
}) => {
    const baseStyles = {
        position: "relative" as const,
        width: "1em",
        height: "1em",
        border: "1px solid currentColor",
        boxSizing: "border-box" as const,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        borderRadius: "50%",
        padding: 0,
    };

    const variantStyle = variantColors(theme, color, checked)[variant];

    return {
        ...baseStyles,
        ...variantStyle,

        'input[type="radio"]:hover + &': variantColors(theme, color, true)[
            variant
        ],

        'input[type="radio"]:active + &': variantColors(theme, color, true)[
            variant
        ],

        'input[type="radio"]:focus-visible + &': {
            boxShadow: `0 0 0 3px ${variantColors(theme, color, true).solid.backgroundColor}`,
            outline: "none",
        },
    };
});

RadioControl.displayName = "RadioControl";

const RadioLabel = styled("span")<{ rtl?: boolean }>(({ rtl }) => ({
    ...(rtl ? { marginRight: "0.5em" } : { marginLeft: "0.5em" }),
}));

RadioLabel.displayName = "RadioLabel";

const IconWrapper = styled("span")<{ size?: Size | number }>(
    ({ size = "md" }) => ({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...resolveIconScaling(size),
        "& > *": {
            width: "100%",
            height: "100%",
        },
    }),
);

IconWrapper.displayName = "IconWrapper";

/**
 *  Radio component for selecting options.
 *  It supports different sizes, colors, and variants.
 *  The component can be controlled or uncontrolled.
 *  It can display custom icons for checked and unchecked states.
 *  The component can be used with a label and supports RTL layout.
 *  The `onChange` event handler is called when the radio state changes.
 *  The `disabled` prop can be used to disable the radio input.
 *  The `name` and `value` props are used to group radio inputs and set the value.
 *  The `checkedIcon` and `uncheckedIcon` props allow for custom icons
 *  to be displayed in the checked and unchecked states, respectively.
 *  The `rtl` prop can be used to control the layout direction.
 */
const Radio = (
    {
        checked: controlledChecked,
        onChange,
        label,
        disabled,
        color = "primary",
        variant = "solid",
        size = "md",
        name,
        value,
        checkedIcon,
        uncheckedIcon,
        rtl,
        ...props
    }: RadioProps,
    ref?: Ref<HTMLInputElement>,
) => {
    const [internalChecked, setInternalChecked] = useState(false);
    const isChecked = controlledChecked ?? internalChecked;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!controlledChecked) setInternalChecked(e.target.checked);
        onChange?.(e);
    };

    return (
        <RadioWrapper disabled={disabled} size={size}>
            <HiddenRadio
                type="radio"
                name={name}
                value={value}
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                ref={ref}
                {...props}
            />
            {rtl && label && <RadioLabel>{label}</RadioLabel>}
            <RadioControl
                name={name}
                role="radio"
                aria-checked={isChecked}
                color={color}
                variant={variant}
                checked={isChecked}
                disabled={disabled}
                size={size}
            >
                {isChecked ? (
                    checkedIcon ? (
                        <IconWrapper size={size}>{checkedIcon}</IconWrapper>
                    ) : (
                        <IconWrapper size={size}>
                            <svg
                                viewBox="0 0 24 24"
                                css={{
                                    fill: "currentColor",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <circle cx="12" cy="12" r={8} />
                            </svg>
                        </IconWrapper>
                    )
                ) : uncheckedIcon ? (
                    <IconWrapper size={size}>{uncheckedIcon}</IconWrapper>
                ) : null}
            </RadioControl>
            {!rtl && label && <RadioLabel>{label}</RadioLabel>}
        </RadioWrapper>
    );
};

Radio.displayName = "Radio";

export { Radio };
