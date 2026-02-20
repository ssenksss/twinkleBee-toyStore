from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionFindToy(Action):
    def name(self) -> Text:
        return "action_find_toy"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        toy_name = next(tracker.get_latest_entity_values("toy_name"), None)
        if toy_name:
            dispatcher.utter_message(text=f"🎁 I found {toy_name}! Check it out in the shop.")
        else:
            dispatcher.utter_message(text="I found some magical toys for you! 🐝")
        return []

class ActionReserveToy(Action):
    def name(self) -> Text:
        return "action_reserve_toy"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        toy_name = next(tracker.get_latest_entity_values("toy_name"), "your toy")
        date = next(tracker.get_latest_entity_values("date"), "soon")
        dispatcher.utter_message(text=f"✅ Reserved {toy_name} for {date} 🐝")
        return []

class ActionShowProfile(Action):
    def name(self) -> Text:
        return "action_show_profile"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_info = tracker.get_slot("user") or {"name": "Toy Lover", "email": "user@example.com", "role": "user"}
        dispatcher.utter_message(
            text=f"👤 Name: {user_info.get('name')}, Email: {user_info.get('email')}, Role: {user_info.get('role')}"
        )
        return []
