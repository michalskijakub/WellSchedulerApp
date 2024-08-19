import React, { useState, useEffect } from "react";
import {
  Scheduler,
  WeekView,
  DayView,
  MonthView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Paper } from "@mui/material";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
  const [data, setData] = useState([]);
  const [currentViewName, setCurrentViewName] = useState("Week");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(eventsData);
    });

    return () => unsubscribe();
  }, []);

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      if (!added.title || added.title.trim() === "") {
        alert("Nie można dodać wydarzenia bez tytułu.");
        return;
      }
      const newEvent = {
        ...added,
        startDate: added.startDate
          ? new Date(added.startDate).toISOString()
          : null,
        endDate: added.endDate ? new Date(added.endDate).toISOString() : null,
      };
      await addDoc(collection(db, "events"), newEvent);
    }

    if (changed) {
      for (let id in changed) {
        if (
          changed[id].title !== undefined &&
          changed[id].title.trim() === ""
        ) {
          alert("Tytuł wydarzenia nie może być pusty.");
          return;
        }
        const eventDoc = doc(db, "events", id);
        const originalEvent = data.find((event) => event.id === id);
        const updatedEvent = {
          ...originalEvent,
          ...changed[id],
          startDate:
            changed[id].startDate !== undefined
              ? new Date(changed[id].startDate).toISOString()
              : originalEvent.startDate,
          endDate:
            changed[id].endDate !== undefined
              ? new Date(changed[id].endDate).toISOString()
              : originalEvent.endDate,
        };
        await updateDoc(eventDoc, updatedEvent);
      }
    }

    if (deleted !== undefined) {
      const eventDoc = doc(db, "events", deleted);
      await deleteDoc(eventDoc);
    }
  };

  return (
    <Paper>
      <Scheduler data={data} locale="pl-PL">
        <ViewState
          currentViewName={currentViewName}
          onCurrentViewNameChange={setCurrentViewName}
        />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <DayView startDayHour={9} endDayHour={18} displayName="Dzień" />
        <WeekView startDayHour={9} endDayHour={18} displayName="Tydzień" />
        <MonthView displayName="Miesiąc" />
        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
        <TodayButton messages={{ today: "Dzisiaj" }} />
        <Appointments />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
          messages={{ deleteButton: "Usuń", openButton: "Otwórz" }}
        />
        <AppointmentForm
          messages={{
            detailsLabel: "Szczegóły",
            commitCommand: "Zapisz",
            discardButton: "Anuluj",
            allDayLabel: "Cały dzień",
            titleLabel: "Tytuł",
            startDateLabel: "Data rozpoczęcia",
            endDateLabel: "Data zakończenia",
            moreInformationLabel: "Więcej informacji",
            repeatLabel: "Powtarzaj",
            notesLabel: "Dodatkowe informacje",
          }}
        />
      </Scheduler>
    </Paper>
  );
}

export default App;
