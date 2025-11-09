import {render, screen} from  "@testing-library/react"
import userEven from "@testing-library/user-event"
import Login from "./login.js"
import * as apiMod from "../lib/api.js"
import { MemoryRouter } from "react-router-dom"
import { describe, test, expect, vi } from 'vitest'


describe("Login Page", () => {

    test("login render & sumbit", async () => {
    vi.spyOn(apiMod.api, "post").mockResolvedValueOnce({
        data:{token:"T", user:{id:"1", email:"e@e.com"}}
    } as any);

    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    await userEven.type(screen.getByPlaceholderText(/email/i), "e@e.com");
    await userEven.type(screen.getByPlaceholderText(/password/i), "1246");
    await userEven.click(screen.getByRole("button", {name:"登录"}));

    expect(await screen.findByRole("button", {name:"登录"})).toBeInTheDocument();
    });

})




