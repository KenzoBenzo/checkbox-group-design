import type { NextPage } from "next";
import { AppShell } from "@saas-ui/app-shell";
import { Sidebar, SidebarSection, NavItem } from "@saas-ui/sidebar";
import { Box, ButtonGroup, Circle, Flex } from "@chakra-ui/react";
import {
	Field,
	Loader,
	Property,
	PropertyList,
	StepperCompleted,
} from "@saas-ui/react";
import {
	StepForm,
	FormStepper,
	FormStep,
	PrevButton,
	NextButton,
	FormLayout,
} from "@saas-ui/forms";
import {
	CheckboxGroupField,
	CheckboxGroupInputType,
} from "../components/checkbox-group";
import scenarioSelected from "../raw-data.json";
import departments from "../departments.json";

type CheckBoxTreeType = CheckboxGroupInputType[];

const checkboxGroups: CheckBoxTreeType = departments.map((department) => ({
	groupLabel: department || "Department",
	children: ["1", "2", "3", "4", "5"].map((level) => ({
		label: `Level ${level}`,
		value: `${department}__${level}`,
	})),
}));

const steps = [
	{
		name: "step 1",
		title: "Who can qualify for the grant?",
		children: (
			<>
				{checkboxGroups?.map((department, index) => {
					return (
						<CheckboxGroupField
							key={index + department.groupLabel}
							name={department.groupLabel}
							options={department.children}
						/>
					);
				})}

				<ButtonGroup mt={4}>
					<NextButton colorScheme='primary' variant='subtle' />
				</ButtonGroup>
			</>
		),
	},
	{
		name: "step 2",
		title: "What percent of employees are yearly promoted?",
		children: (
			<>
				<PropertyList>
					<Property
						label='Level 1 to 2'
						value={<Field type='number' name='oneToTwo' size='sm' />}
					/>
					<Property
						label='Level 2 to 3'
						value={<Field type='number' name='twoToThree' size='sm' />}
					/>
					<Property
						label='Level 3 to 4'
						value={<Field type='number' name='threeToFour' size='sm' />}
					/>
					<Property
						label='Level 4 to 5'
						value={<Field type='number' name='fourToFive' size='sm' />}
					/>
					<Property
						label='Level 5 to 6'
						value={<Field type='number' name='fiveToSix' size='sm' />}
					/>
				</PropertyList>

				<ButtonGroup mt={4}>
					<NextButton colorScheme='primary' variant='subtle' />
					<PrevButton variant='subtle' />
				</ButtonGroup>
			</>
		),
	},
];

const Home: NextPage = () => {
	const onSubmit = (params: unknown) => {
		console.log(params);
		return new Promise((resolve) => {
			setTimeout(resolve, 1000);
		});
	};

	const defaultCheckboxValues = departments.reduce(
		(a, v) => ({
			...a,
			// @ts-ignore true types exist, this is bespoke to my system
			[v]: scenarioSelected.promotionQualified?.filter((item) =>
				item.includes(v)
			),
		}),
		{}
	);

	return (
		<AppShell
			variant='static'
			height='100vh'
			navbar={
				<Flex
					p={2}
					align='center'
					w='100%'
					position='sticky'
					borderBottom='1px solid'
					borderColor='gray.200'
					backgroundColor='white'
					top={0}
					left={0}
					right={0}
					zIndex={2}
				>
					<Circle size={4} backgroundColor='primary.500' mr={3} />
					Company logo
				</Flex>
			}
			sidebar={
				<Sidebar>
					<SidebarSection>
						<NavItem label='Home' />
						<NavItem label='Settings' />
					</SidebarSection>
				</Sidebar>
			}
		>
			<Box as='main' flex='1' p={4}>
				<StepForm
					onSubmit={onSubmit}
					defaultValues={{
						...defaultCheckboxValues,
						oneToTwo: 100,
						twoToThree: 50,
						threeToFour: 30,
						fourToFive: 10,
						fiveToSix: 2,
					}}
				>
					<FormLayout>
						<FormStepper orientation='vertical'>
							{steps.map((args, i) => (
								<FormStep key={i} {...args} />
							))}

							<StepperCompleted>
								<Loader>You&apos;re all done!</Loader>
							</StepperCompleted>
						</FormStepper>
					</FormLayout>
				</StepForm>
			</Box>
		</AppShell>
	);
};

export default Home;
