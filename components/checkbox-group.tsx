import {
	chakra,
	Checkbox as ChakraCheckbox,
	CheckboxProps,
	Collapse,
	Flex,
	HTMLChakraProps,
	Stack,
	useDisclosure,
	useFormControl,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { IconButton } from "@saas-ui/react";
import React, { FormEvent } from "react";
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
// .transform((group) => ({
// 	groupLabel: group.groupLabel,
// 	children: group.children.map((checkbox) => ({
// 		label: checkbox.label,
// 		isDisabled: checkbox.isDisabled,
// 		isSelected: checkbox.isSelected,
// 		value: `${group.groupLabel}-${checkbox.label.split(" ")[1]}`,
// 	})),
// }));

export type CheckboxGroupInputType = z.input<typeof CheckboxGroupType>;
export type CheckboxGroupType = z.infer<typeof CheckboxGroupType>;

export const CheckboxGroup = ({ group }: { group: CheckboxGroupInputType }) => {
	const { groupLabel, isCollapsed, children } = CheckboxGroupType.parse(group);
	const [checkedItems, setCheckedItems] = React.useState(
		children
			.sort((a, b) => a.label.localeCompare(b.label))
			.map((mappedGroup) => {
				return mappedGroup.isSelected;
			})
	);

	const allChecked = checkedItems.every(Boolean);
	const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

	const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: !isCollapsed });

	return (
		<>
			<Flex>
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
					{groupLabel}
				</Checkbox>
			</Flex>
			<Collapse in={isOpen}>
				<Stack pl={12} mt={1} spacing={1}>
					{children.map((checkbox, index) => {
						const onChangeCheckbox = ({
							event,
							label,
						}: {
							event: FormEvent<HTMLInputElement>;
							label: string;
						}) => {
							// find the index of the current checkbox, and invert the value, otherwise return it's proper value.
							const updatedCheckboxes: boolean[] = children
								.sort((a, b) => a.label.localeCompare(b.label))
								.map((item, index) =>
									item.label === label
										? // @ts-ignore this is a tricky type
										  event.target.checked
										: checkedItems[index]
								);
							setCheckedItems(updatedCheckboxes);
						};
						return (
							<Checkbox
								key={checkbox.label + group.groupLabel}
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
