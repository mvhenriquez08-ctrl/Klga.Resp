import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  activeClassName?: string;
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, to, end, children, ...props }, ref) => {
    return (
      <a ref={ref} href={to} className={className} {...props}>
        {children}
      </a>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
