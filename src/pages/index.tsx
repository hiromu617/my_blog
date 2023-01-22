import {
  Stack,
  Card,
  Text,
  Group,
  Pagination,
  Center,
  Anchor,
  useMantineColorScheme,
  Container,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useMediaQuery } from "@mantine/hooks";

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const isSP = useMediaQuery("(max-width: 576px)");

  return (
    <Container size="xs" p={isSP ? 0 : undefined}>
      <Stack spacing="lg">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Card
            key={i}
            radius="md"
            withBorder
            component={NextLink}
            href={`/${i}`}
            sx={(theme) => ({
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
            legacyBehavior
          >
            <Text weight={500} fz="xl" mb={6}>
              console.log()だけのデバッグはやめよう
            </Text>
            <Group mb={6}>
              <Anchor href="https://asds"># React</Anchor>
              <Anchor href="https://asds"># Next.js</Anchor>
            </Group>
            <Text>2023.01.22</Text>
          </Card>
        ))}
        <Center my={20}>
          <Pagination total={10} color={dark ? "blue" : "dark"} radius="md" />
        </Center>
      </Stack>
    </Container>
  );
}
