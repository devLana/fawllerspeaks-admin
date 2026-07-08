import { getStorageTheme, saveStorageTheme } from ".";
import { DEFAULT_THEME } from "@utils/constants";

describe("storageTheme", () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe("getStorageTheme", () => {
    describe("Theme object validation and parsing", () => {
      it("Expect null to be returned when localStorage is empty", () => {
        const result = getStorageTheme();
        expect(result).toBeNull();
      });

      it.each([
        [
          "Expect null to be returned when JSON parsing fails",
          "{ invalid json }",
        ],
        [
          "Expect null to be returned when parsed value is not an object",
          '"string value"',
        ],
        [
          "Expect null to be returned when parsed value is an array of any kind",
          '["sunny", 16, "#7dd1f3"]',
        ],
        ["Expect null to be returned when parsed value is null", "null"],
      ])("%s", (_, value) => {
        localStorage.setItem(DEFAULT_THEME, value);
        const result = getStorageTheme();
        expect(result).toBeNull();
      });
    });

    describe("Missing theme object keys", () => {
      it.each([
        [
          "Expect null to be returned when themeMode key is missing",
          '{ "fontSize": 16, "color": "#7dd1f3" }',
        ],
        [
          "Expect null to be returned when fontSize key is missing",
          '{ "themeMode": "sunny", "color": "#7dd1f3" }',
        ],
        [
          "Expect null to be returned when color key is missing",
          '{ "themeMode": "sunny", "fontSize": 16 }',
        ],
      ])("%s", (_, value) => {
        localStorage.setItem(DEFAULT_THEME, value);
        const result = getStorageTheme();
        expect(result).toBeNull();
      });
    });

    describe("Invalid themeMode values", () => {
      it.each([
        [
          "Expect null to be returned when themeMode is not a string",
          '{ "themeMode": 123, "fontSize": 16, "color": "#7dd1f3" }',
        ],
        [
          "Expect null to be returned when themeMode is not of a recognized value",
          '{ "themeMode": "invalid", "fontSize": 16, "color": "#7dd1f3" }',
        ],
      ])("%s", (_, value) => {
        localStorage.setItem(DEFAULT_THEME, value);
        const result = getStorageTheme();
        expect(result).toBeNull();
      });
    });

    describe("Invalid fontSize values", () => {
      it.each([
        [
          "Expect null to be returned when fontSize is not a number",
          '{ "themeMode": "sunny", "fontSize": "16", "color": "#7dd1f3" }',
        ],
        [
          "Expect null to be returned when fontSize is null",
          '{ "themeMode": "sunny", "fontSize": null, "color": "#7dd1f3" }',
        ],
      ])("%s", (_, value) => {
        localStorage.setItem(DEFAULT_THEME, value);
        const result = getStorageTheme();
        expect(result).toBeNull();
      });
    });

    describe("Invalid color values", () => {
      it.each([
        [
          "Expect null to be returned when color is not a string",
          '{ "themeMode": "sunny", "fontSize": 16, "color": 123 }',
        ],
        [
          "Expect null to be returned when color is an invalid hex value",
          '{ "themeMode": "sunny", "fontSize": 16, "color": "#fff" }',
        ],
      ])("%s", (_, value) => {
        localStorage.setItem(DEFAULT_THEME, value);
        const result = getStorageTheme();
        expect(result).toBeNull();
      });
    });

    describe("Valid theme values", () => {
      it.each([
        [
          "Expect theme with themeMode 'sunny' to be returned",
          { themeMode: "sunny", fontSize: 16, color: "#7dd1f3" },
        ],
        [
          "Expect theme with themeMode 'sunset' returned",
          { themeMode: "sunset", fontSize: 14, color: "#6a6a6a" },
        ],
        [
          "Expect theme with themeMode 'pitch black' returned",
          { themeMode: "pitch black", fontSize: 18, color: "#7dd1f3" },
        ],
        [
          "Expect theme object with fontSize '22' to be returned",
          { themeMode: "sunset", fontSize: 22, color: "#6a6a6a" },
        ],
        [
          "Expect a stored theme with color value #7dd1f3 to be returned",
          { themeMode: "sunny", fontSize: 16, color: "#7dd1f3" },
        ],
        [
          "Expect a stored theme with color value #6a6a6a to be returned",
          { themeMode: "sunny", fontSize: 16, color: "#6a6a6a" },
        ],
      ])("%s", (_, validTheme) => {
        localStorage.setItem(DEFAULT_THEME, JSON.stringify(validTheme));
        const result = getStorageTheme();
        expect(result).toStrictEqual(validTheme);
      });

      it("Expect extra properties in stored theme to be ignored", () => {
        const theme = {
          themeMode: "sunny",
          fontSize: 16,
          color: "#7dd1f3",
          extraKey: "ignored",
        };

        localStorage.setItem(DEFAULT_THEME, JSON.stringify(theme));
        const result = getStorageTheme();

        expect(result).toStrictEqual({
          themeMode: "sunny",
          fontSize: 16,
          color: "#7dd1f3",
        });
      });
    });
  });

  describe("saveStorageTheme", () => {
    const defaultTheme = {
      themeMode: "sunny",
      fontSize: 16,
      color: "#7dd1f3",
    } as const;

    it.each([
      [
        "themeMode",
        "sunset",
        { themeMode: "sunset", fontSize: 16, color: "#7dd1f3" },
      ],
      ["fontSize", 18, { themeMode: "sunny", fontSize: 18, color: "#7dd1f3" }],
      [
        "color",
        "#6a6a6a",
        { themeMode: "sunny", fontSize: 16, color: "#6a6a6a" },
      ],
    ] as const)(
      "Expect a %s update to be saved to localStorage",
      (key, value, expected) => {
        saveStorageTheme(defaultTheme, key, value);
        expect(getStorageTheme()).toStrictEqual(expected);
      },
    );

    it("Expect the default theme to be used if localStorage is empty", () => {
      saveStorageTheme(defaultTheme, "themeMode", "pitch black");
      const stored = getStorageTheme();

      expect(stored).toStrictEqual({
        ...defaultTheme,
        themeMode: "pitch black",
      });
    });

    it("Expect other theme values to be preserved when updating a single theme", () => {
      const theme = {
        themeMode: "sunset",
        fontSize: 14,
        color: "#6a6a6a",
      } as const;

      localStorage.setItem(DEFAULT_THEME, JSON.stringify(theme));
      saveStorageTheme(defaultTheme, "fontSize", 22);

      const stored = getStorageTheme();

      expect(stored).toEqual({
        themeMode: "sunset",
        fontSize: 22,
        color: "#6a6a6a",
      });
    });

    it("Expect multiple sequential theme updates to be handled", () => {
      saveStorageTheme(defaultTheme, "themeMode", "sunset");
      saveStorageTheme(defaultTheme, "fontSize", 14);
      saveStorageTheme(defaultTheme, "color", "#6a6a6a");

      const stored = getStorageTheme();

      expect(stored).toEqual({
        themeMode: "sunset",
        fontSize: 14,
        color: "#6a6a6a",
      });
    });
  });
});
