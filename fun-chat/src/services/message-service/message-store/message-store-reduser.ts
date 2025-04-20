import type {
  Message,
  MessagesState,
  ActionUnionTypes,
} from "@/services/message-service/message-types.ts";
import type { MessagePayload } from "@/services/message-service/message-types.ts";
import { MessagesStateKeys } from "@/services/message-service/message-types.ts";
import { MessagesStateActions } from "@/services/message-service/message-types.ts";

export function messageStoreReducer(
  state: MessagesState,
  action: ActionUnionTypes,
): MessagesState {
  switch (action.type) {
    case MessagesStateActions.SET_MESSAGES: {
      const messages = new Map<string, Message>();
      for (const message of action.payload) {
        messages.set(message.id, message);
      }
      return { ...state, messages: messages };
    }
    case MessagesStateActions.SET_DIALOG_ID: {
      return { ...state, dialogId: action.payload };
    }
    case MessagesStateActions.ADD_MESSAGE: {
      state.messages.set(...action.payload);
      return { ...state, messages: state.messages };
    }
    case MessagesStateActions.DELETE_MESSAGE: {
      state.messages.delete(action.payload);
      return { ...state, messages: state.messages };
    }
    case MessagesStateActions.EDIT_MESSAGE: {
      return changeStatus(state, action.payload, "isEdited");
    }
    case MessagesStateActions.DELIVER_MESSAGE: {
      return changeStatus(state, action.payload, "isDelivered");
    }
    case MessagesStateActions.READED_MESSAGE: {
      return changeStatus(state, action.payload, "isReaded");
    }
    case MessagesStateActions.CLEAR_DIALOG: {
      return { ...state, messages: new Map<string, Message>() };
    }

    default: {
      return state;
    }
  }
}

function changeStatus(
  state: MessagesState,
  payload:
    | MessagePayload<Pick<Message, "id" | "status">>
    | MessagePayload<Pick<Message, "id" | "status" | "text">>,
  key: "isReaded" | "isDelivered" | "isEdited",
): MessagesState {
  const messages = state.messages;
  const message = messages.get(payload.message.id);
  const messageStatus = message?.status;
  if (!messageStatus) {
    return state;
  }
  messageStatus[key] = payload.message.status[key];
  if (key === "isEdited" && "text" in payload.message) {
    message.text = payload.message.text;
  }
  return { ...state, [MessagesStateKeys.MESSAGES]: messages };
}
