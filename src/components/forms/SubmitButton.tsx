import { type ComponentProps } from "react";

type Props = Omit<ComponentProps<"button">, "type">;

const SubmitButton = (props: Props) => <button {...props} type="submit" />;

export default SubmitButton;
