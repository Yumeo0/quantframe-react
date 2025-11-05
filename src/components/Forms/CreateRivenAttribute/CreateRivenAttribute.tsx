import { ActionWithTooltip } from "@components/Shared/ActionWithTooltip";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useTranslateForms } from "@hooks/useTranslate.hook";
import { Flex, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import type { RivenAttribute, TauriTypes } from "$types";

export type CreateRivenAttributeProps = {
	availableAttributes: TauriTypes.CacheRivenAttribute[];
	value: RivenAttribute;
	positiveNumberOnly?: boolean;
	negativeNumberOnly?: boolean;
	canRemove?: boolean;
	onChange?: (values: RivenAttribute) => void;
	onRemove?: (index: number) => void;
};
export function CreateRivenAttribute({
	positiveNumberOnly,
	negativeNumberOnly,
	availableAttributes,
	onChange,
	canRemove,
	onRemove,
	value,
}: CreateRivenAttributeProps) {
	const [currentValue, setCurrentValue] = useState<
		TauriTypes.CacheRivenAttribute | undefined
	>(undefined);

	// Translate general
	const tValueErrorPositive = useTranslateForms(
		"create_riven_attribute.fields.value.error.positive",
	);
	const tValueErrorNegative = useTranslateForms(
		"create_riven_attribute.fields.value.error.negative",
	);
	const tValueError = useTranslateForms(
		"create_riven_attribute.fields.value.error",
	);
	const tButtonRemove = useTranslateForms(
		"create_riven_attribute.buttons.remove",
	);

	// User form
	const form = useForm({
		initialValues: {
			...value,
		},
		validate: {
			value: (value: number) => {
				if (positiveNumberOnly && value < 0) return tValueErrorPositive;
				if (negativeNumberOnly && value > 0) return tValueErrorNegative;
				if (currentValue?.positiveOnly && value < 0) return tValueErrorPositive;
				if (currentValue?.negativeOnly && value > 0) return tValueErrorNegative;
				return null;
			},
		},
		onValuesChange: (values) => {
			onChange?.(values);
		},
	});

	useEffect(() => {
		if (value.url_name) {
			const attr = availableAttributes.find(
				(item) => item.url_name === value.url_name,
			);
			setCurrentValue(attr);
		}
	}, [value.url_name, availableAttributes]);

	// Helper functions
	const getAvailableAttributes = () => {
		return availableAttributes.map((item) => ({
			label: item.effect,
			value: item.url_name,
		}));
	};

	const GetUnitSymbol = () => {
		if (currentValue?.unit === "multiply") return "+";
		if (currentValue?.unit === "percent") return "%";
		if (currentValue?.unit === "seconds") return "sec";
		return undefined;
	};

	const GetMaxValue = () => {
		if (
			(positiveNumberOnly && form.values.value < 0) ||
			(negativeNumberOnly && form.values.value > 0)
		)
			return undefined;
		if (positiveNumberOnly && currentValue?.unit !== "multiply") return 400;
		if (positiveNumberOnly && currentValue?.unit === "multiply") return 4;

		if (negativeNumberOnly && currentValue?.unit === "multiply") return 1;
		if (negativeNumberOnly && currentValue?.unit !== "multiply") return 0;
		return undefined;
	};

	const GetMinValue = () => {
		if (
			(positiveNumberOnly && form.values.value < 0) ||
			(negativeNumberOnly && form.values.value > 0)
		)
			return undefined;
		if (positiveNumberOnly) return 0;
		if (negativeNumberOnly && currentValue?.unit !== "multiply") return -400;
		if (negativeNumberOnly && currentValue?.unit === "multiply") return 0;
		return undefined;
	};

	const ValidateValue = () => {
		// TODO: Validate value based on positiveNumberOnly and negativeNumberOnly
		// console.log("ValidateValue", form.values.value);
		// const isNegative = negativeNumberOnly == undefined ? false : negativeNumberOnly;
		// if ((positiveNumberOnly && form.values.value < 0) || ((isNegative && form.values.value > 0) != currentValue?.unit) == "multiply")
		//   form.setFieldValue("value", -form.values.value);
	};

	return (
		<Flex gap={"xs"} align="center">
			<Select
				searchable
				clearable
				w={"100%"}
				limit={5}
				value={form.values.url_name || ""}
				onChange={(event) => {
					form.setFieldValue("url_name", event || "");
					form.setFieldValue("value", 0);
				}}
				data={getAvailableAttributes()}
			/>
			<NumberInput
				w={150}
				disabled={form.values.url_name === "N/A" || form.values.url_name === ""}
				step={currentValue?.unit === "multiply" ? 0.1 : 1}
				decimalScale={currentValue?.unit === "multiply" ? 2 : 1}
				max={GetMaxValue()}
				min={GetMinValue()}
				onBlur={() => ValidateValue()}
				value={form.values.value || 0}
				rightSection={
					currentValue?.unit === "multiply" ? undefined : GetUnitSymbol()
				}
				leftSection={
					currentValue?.unit === "multiply" ? GetUnitSymbol() : undefined
				}
				onChange={(event) => form.setFieldValue("value", Number(event))}
				error={form.errors.value && tValueError}
				radius="md"
			/>
			{onRemove && canRemove && (
				<ActionWithTooltip
					icon={faClose}
					tooltip={tButtonRemove}
					color="red"
					onClick={() => {
						onRemove?.(0);
					}}
				/>
			)}
		</Flex>
	);
}
