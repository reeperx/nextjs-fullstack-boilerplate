import { render, screen } from "@testing-library/react"
import HomePage from "@/app/[locale]/page"

// Mock the next-intl hook
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}))

// Mock the next/navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
}))

describe("HomePage", () => {
  it("renders the home page title", () => {
    render(<HomePage />)

    // Check if the title is rendered
    expect(screen.getByText("home.title")).toBeInTheDocument()
  })

  it("renders the feature cards", () => {
    render(<HomePage />)

    // Check if all feature cards are rendered
    expect(screen.getByText("home.features.auth.title")).toBeInTheDocument()
    expect(screen.getByText("home.features.database.title")).toBeInTheDocument()
    expect(screen.getByText("home.features.payments.title")).toBeInTheDocument()
  })
})

