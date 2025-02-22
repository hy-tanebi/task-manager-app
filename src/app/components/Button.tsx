import Link from "next/link";
import React from "react";

interface ButtonProps {
  title: string;
  href: string;
}

const Button = ({ title, href }: ButtonProps) => {
  return <Link href={`${href}`}>{title}</Link>;
};

export default Button;
