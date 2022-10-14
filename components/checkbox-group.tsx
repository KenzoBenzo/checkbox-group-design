import {
	Checkbox as ChakraCheckbox,
	CheckboxProps,
	Collapse,
	Flex,
	Stack,
	useControllableState,
	useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { IconButton } from "@saas-ui/react";
import React, { ChangeEvent } from "react";
import { z } from "zod";
import { registerFieldType } from "@saas-ui/forms";
import { CustomCheckboxIcon } from "./checkbox-icon";

const Checkbox = (props: CheckboxProps) => {
	return <ChakraCheckbox icon={<CustomCheckboxIcon />} {...props} />;
};

export const CheckboxGroupType = z.object({
	groupLabel: z.string(),
	isCollapsed: z.boolean().optional().default(true),
	children: z.array(
		z.object({
			label: z.string(),
			value: z.string().min(1),
			isDisabled: z.boolean().optional().default(false),
		})
	),
});

export type CheckboxGroupInputType = z.input<typeof CheckboxGroupType>;
export type CheckboxGroupType = z.infer<typeof CheckboxGroupType>;

export const CheckboxGroup = ({
	name,
	value,
	defaultValue,
	onChange,
	options,
	isCollapsed = true,
}: {
	name: CheckboxGroupInputType["groupLabel"];
	value?: string[];
	defaultValue?: string[];
	options: CheckboxGroupInputType["children"];
	onChange?: (value: string[]) => void;
	isCollapsed?: boolean;
}) => {
	const [checkedItems, setCheckedItems] = useControllableState({
		value,
		defaultValue,
		onChange,
	});

	const allChecked = checkedItems?.length === options.length;
	const isIndeterminate = checkedItems?.length > 0 && !allChecked;

	const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: !isCollapsed });

	return (
		<>
			<Flex role='group'>
				<IconButton
					onClick={onToggle}
					aria-label='Open indicator'
					icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
					variant='ghost'
					size='xs'
					mr={2}
				/>
				<Checkbox
					isChecked={allChecked}
					isIndeterminate={isIndeterminate}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setCheckedItems(
							e.target.checked ? options.map((item) => item.value) : []
						)
					}
				>
					{name}
				</Checkbox>
			</Flex>
			<Collapse in={isOpen}>
				<Stack pl={12} mt={1} spacing={1}>
					{options.map((checkbox, index) => {
						const onChangeCheckbox = ({
							event,
							value,
						}: {
							event: ChangeEvent<HTMLInputElement>;
							value: string;
						}) => {
							// check if the value exists in the checkedItems array, and if it does, filter it out. If it doesn't add it. Sort at the end so that it goes in order of number level

							// Clone the list of checked items
							let newCheckedItems = [...checkedItems];
							const updatedCheckboxes: string[] = (
								checkedItems.find((item) => item == value)
									? newCheckedItems.filter((item) => item !== value)
									: [...newCheckedItems, value]
							).sort((a, b) => a.localeCompare(b));

							setCheckedItems(updatedCheckboxes);
						};
						return (
							<Checkbox
								key={checkbox.label + name}
								role='treeitem'
								aria-labelledby={name + " " + checkbox.label}
								isChecked={
									checkedItems.find((item) => item == checkbox.value)
										? true
										: false
								}
								onChange={(event) =>
									onChangeCheckbox({ event, value: checkbox.value })
								}
								isDisabled={checkbox.isDisabled}
							>
								{checkbox.label}
							</Checkbox>
						);
					})}
				</Stack>
			</Collapse>
		</>
	);
};

export const CheckboxGroupField = registerFieldType(
	"CheckboxGroup",
	CheckboxGroup,
	{
		isControlled: true,
	}
);
