export interface messageType {
  replace(arg0: string, arg1: string): unknown;
  isUserMessage: boolean;
  text: string;
  id: string;
}
