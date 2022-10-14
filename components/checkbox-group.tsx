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
import React, { ChangeEvent, FormEvent } from "react";
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
			isSelected: z.boolean().optional().default(false),
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
	value?: boolean[];
	defaultValue?: boolean[];
	options: CheckboxGroupInputType["children"];
	onChange?: (value: boolean[]) => void;
	isCollapsed?: boolean;
}) => {
	const [checkedItems, setCheckedItems] = useControllableState({
		value,
		defaultValue,
		onChange,
	});

	const allChecked = checkedItems.every(Boolean);
	const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

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
					onChange={(e) =>
						setCheckedItems(checkedItems.map((item) => e.target.checked))
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
							label,
						}: {
							event: ChangeEvent<HTMLInputElement>;
							label: string;
						}) => {
							// find the index of the current checkbox, and invert the value, otherwise return it's proper value.
							const updatedCheckboxes: boolean[] = options
								.sort((a, b) => a.label.localeCompare(b.label))
								.map((item, index) =>
									item.label === label
										? event.target.checked
										: checkedItems[index]
								);
							setCheckedItems(updatedCheckboxes);
						};
						return (
							<Checkbox
								key={checkbox.label + name}
								role='treeitem'
								aria-labelledby={name + " " + checkbox.label}
								isChecked={checkedItems[index]}
								onChange={(event) =>
									onChangeCheckbox({ event, label: checkbox.label })
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
