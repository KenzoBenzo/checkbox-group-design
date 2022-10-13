import { Icon, IconProps } from "@chakra-ui/react";

export const CustomCheckboxIcon = (props: {
	isIndeterminate?: boolean;
	isChecked?: boolean;
	rest?: IconProps;
}) => {
	const { isIndeterminate, isChecked, ...rest } = props;

	const d = isIndeterminate ? "M5 12H19" : "M20 6L9 17L4 12";

	return (
		<Icon viewBox='0 0 24 24' fill='none' {...rest}>
			<path
				stroke='currentColor'
				strokeWidth='4'
				strokeLinecap='round'
				strokeLinejoin='round'
				d={d}
			/>
		</Icon>
	);
};
