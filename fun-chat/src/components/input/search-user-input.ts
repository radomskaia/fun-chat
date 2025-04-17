import { BaseInput } from "@/components/input/base-input.ts";

export class SearchUserInput extends BaseInput {
  constructor() {
    super({
      placeholder: "Search",
    });
    this.element.type = "search";
  }
}
