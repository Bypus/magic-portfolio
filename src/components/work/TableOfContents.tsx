"use client";

import type React from "react";
import { Column, Flex, Text } from "@once-ui-system/core";
import styles from "./work.module.scss";
import { slugify as transliterate } from "transliteration";

interface TableOfContentsProps {
  structure: {
    title: string;
    level: number;
  }[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure }) => {
  const slugify = (str: string): string => {
    const strWithAnd = str.replace(/&/g, " and ");
    return transliterate(strWithAnd, {
      lowercase: true,
      separator: "-",
    }).replace(/\-\-+/g, "-");
  };

  const scrollTo = (title: string, offset: number) => {
    const id = slugify(title);
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!structure || structure.length === 0) return null;

  return (
    <Column
      left="0"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
      position="fixed"
      paddingLeft="24"
      gap="32"
      m={{ hide: true }}
    >
      {structure.map((item) => (
        <Flex
          key={item.title}
          cursor="interactive"
          className={styles.hover}
          gap="8"
          paddingLeft={item.level === 2 ? "0" : "24"}
          vertical="center"
          onClick={() => scrollTo(item.title, 80)}
        >
          <Flex
            height="1"
            minWidth={item.level === 2 ? "16" : "8"}
            background="neutral-strong"
          />
          <Text variant={item.level === 2 ? "body-default-m" : "body-default-s"}>
            {item.title}
          </Text>
        </Flex>
      ))}
    </Column>
  );
};

export default TableOfContents;
