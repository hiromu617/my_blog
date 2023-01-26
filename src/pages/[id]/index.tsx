import {
  Stack,
  Text,
  Group,
  Anchor,
  Title,
  useMantineColorScheme,
  Container,
} from "@mantine/core";
import { NextLink } from "@mantine/next";

export default function ArticlePage() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Title weight={500} ta="center">
          console.log()だけのデバッグはやめよう
        </Title>
        <Group mb={6} m="auto">
          <Anchor href="https://asds"># React</Anchor>
          <Anchor href="https://asds"># Next.js</Anchor>
        </Group>
        <Text component="time" ta="center">
          2023.01.22
        </Text>
        <article>
          あああああああああああああああああああああああああああああああああああああああああああ
        </article>
      </Stack>
    </Container>
  );
}
