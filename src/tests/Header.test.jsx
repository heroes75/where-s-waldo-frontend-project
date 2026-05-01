import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Header from "../Components/Header";
import {  MemoryRouter } from "react-router";

describe("Header", () => {
    it("renders header and all this components", () => {
		render(<MemoryRouter>
			<Header />
		</MemoryRouter>)
        // render(<Header />);
        const header = screen.getByRole("banner");
        const nav = screen.getByRole("navigation");
        const ul = screen.getByRole("list");
        const lists = screen.getAllByRole("listitem");
        expect(header).toBeInTheDocument();
        expect(nav).toBeInTheDocument();
        expect(ul).toBeInTheDocument();
        expect(lists.length).toBe(3);
    });
});
