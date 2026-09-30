import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";

import jobEditStyles from "./JobEdit.styles";

import { getJobById, Job, updateJob } from "@/lib/jobservice";
import { getTicketById, Ticket } from "@/lib/ticketservice";
import { Customer, getCustomerById } from "@/lib/customerservice";

import {
  Category,
  getAllCategories,
} from "@/lib/categoryservice";

import {
  Part,
  getAllParts,
} from "@/lib/partservice";

interface JobViewProps {
  jobId: number;
  currentUserId: number;
  currentUserName?: string;
  goToJobs: () => void;
  goToInvoiceCreate?: (jobId: number) => void;
}

interface JobFormState {
  priority: string;
  expectedDate: string;
  startingDateTime: string;
  endingDateTime: string;
  jobDescription: string;
  status: string;
  employeeStatus: string;
  categoryId: number | null;
  partId: number | null;
}

type CalendarTarget =
  | "expected"
  | "start"
  | "end"
  | null;

const emptyJobForm: JobFormState = {
  priority: "NORMAL",
  expectedDate: "",
  startingDateTime: "",
  endingDateTime: "",
  jobDescription: "",
  status: "PENDING",
  employeeStatus: "",
  categoryId: null,
  partId: null,
};

const PRIORITY_OPTIONS = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
];

const STATUS_OPTIONS = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "CLOSED",
];

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ============================================================
   PURE REACT NATIVE CALENDAR
   No native date picker dependency
============================================================ */

interface CalendarModalProps {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

function CalendarModal({
  visible,
  initialDate,
  onClose,
  onSelect,
}: CalendarModalProps) {
  const [calendarDate, setCalendarDate] =
    useState<Date>(new Date());

  useEffect(() => {
    if (visible) {
      setCalendarDate(
        new Date(
          initialDate.getFullYear(),
          initialDate.getMonth(),
          1
        )
      );
    }
  }, [visible, initialDate]);

  const year =
    calendarDate.getFullYear();

  const month =
    calendarDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const previousMonth = () => {
    setCalendarDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCalendarDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const goToToday = () => {
    const today =
      new Date();

    setCalendarDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  const handleDayPress = (
    day: number
  ) => {
    const selected =
      new Date(
        year,
        month,
        day
      );

    onSelect(selected);
  };

  const days: Array<
    number | null
  > = [];

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    days.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    days.push(day);
  }

  while (
    days.length % 7 !== 0
  ) {
    days.push(null);
  }

  const today =
    new Date();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            "rgba(0,0,0,0.45)",
          justifyContent:
            "center",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor:
              "#FFFFFF",
            borderRadius: 16,
            overflow: "hidden",
            elevation: 8,
            shadowColor: "#000000",
            shadowOpacity: 0.18,
            shadowRadius: 12,
            shadowOffset: {
              width: 0,
              height: 5,
            },
          }}
        >
          {/* HEADER */}

          <View
            style={{
              backgroundColor:
                "#dd651b",
              paddingHorizontal: 18,
              paddingVertical: 16,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: "600",
                opacity: 0.9,
              }}
            >
              SELECT DATE
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "800",
                marginTop: 4,
              }}
            >
              {MONTH_NAMES[month]}{" "}
              {year}
            </Text>
          </View>

          {/* MONTH NAVIGATION */}

          <View
            style={{
              flexDirection:
                "row",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              paddingHorizontal:
                12,
              paddingVertical:
                12,
              borderBottomWidth:
                1,
              borderBottomColor:
                "#EEF0F2",
            }}
          >
            <TouchableOpacity
              onPress={
                previousMonth
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color="#333333"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                goToToday
              }
            >
              <Text
                style={{
                  color:
                    "#dd651b",
                  fontSize: 13,
                  fontWeight:
                    "700",
                }}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                nextMonth
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems:
                  "center",
                justifyContent:
                  "center",
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color="#333333"
              />
            </TouchableOpacity>
          </View>

          {/* WEEK DAYS */}

          <View
            style={{
              flexDirection:
                "row",
              paddingHorizontal:
                10,
              paddingTop: 12,
            }}
          >
            {WEEK_DAYS.map(
              (day) => (
                <View
                  key={day}
                  style={{
                    flex: 1,
                    alignItems:
                      "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight:
                        "700",
                      color:
                        "#8A96A3",
                    }}
                  >
                    {day}
                  </Text>
                </View>
              )
            )}
          </View>

          {/* CALENDAR */}

          <View
            style={{
              paddingHorizontal:
                10,
              paddingTop: 8,
              paddingBottom:
                12,
            }}
          >
            {Array.from(
              {
                length:
                  days.length /
                  7,
              },
              (_, weekIndex) => {
                const week =
                  days.slice(
                    weekIndex *
                      7,
                    weekIndex *
                      7 +
                      7
                  );

                return (
                  <View
                    key={
                      weekIndex
                    }
                    style={{
                      flexDirection:
                        "row",
                      marginBottom:
                        4,
                    }}
                  >
                    {week.map(
                      (
                        day,
                        dayIndex
                      ) => {
                        if (
                          day ===
                          null
                        ) {
                          return (
                            <View
                              key={
                                dayIndex
                              }
                              style={{
                                flex: 1,
                                height: 42,
                              }}
                            />
                          );
                        }

                        const isToday =
                          day ===
                            today.getDate() &&
                          month ===
                            today.getMonth() &&
                          year ===
                            today.getFullYear();

                        return (
                          <TouchableOpacity
                            key={
                              dayIndex
                            }
                            onPress={() =>
                              handleDayPress(
                                day
                              )
                            }
                            style={{
                              flex: 1,
                              height: 42,
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                            }}
                          >
                            <View
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius:
                                  18,
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                backgroundColor:
                                  isToday
                                    ? "#FFF0E8"
                                    : "transparent",
                                borderWidth:
                                  isToday
                                    ? 1
                                    : 0,
                                borderColor:
                                  "#dd651b",
                              }}
                            >
                              <Text
                                style={{
                                  color:
                                    isToday
                                      ? "#dd651b"
                                      : "#333333",
                                  fontSize:
                                    13,
                                  fontWeight:
                                    isToday
                                      ? "800"
                                      : "500",
                                }}
                              >
                                {
                                  day
                                }
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                );
              }
            )}
          </View>

          {/* FOOTER */}

          <View
            style={{
              flexDirection:
                "row",
              borderTopWidth:
                1,
              borderTopColor:
                "#EEF0F2",
              padding: 12,
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={
                onClose
              }
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor:
                  "#DDE2E7",
                borderRadius: 9,
                paddingVertical:
                  12,
                alignItems:
                  "center",
              }}
            >
              <Text
                style={{
                  color:
                    "#555555",
                  fontWeight:
                    "700",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ============================================================
   JOB VIEW
============================================================ */

function JobView({
  jobId,
  currentUserId,
  currentUserName,
  goToJobs,
  goToInvoiceCreate,
}: JobViewProps) {
  const [job, setJob] =
    useState<Job | null>(null);

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [customer, setCustomer] =
    useState<Customer | null>(
      null
    );

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [parts, setParts] =
    useState<Part[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [taking, setTaking] =
    useState(false);

  const [startingJob, setStartingJob] =
    useState(false);

  const [endingJob, setEndingJob] =
    useState(false);

  const [isEditingJob, setIsEditingJob] =
    useState(false);

  const [jobForm, setJobForm] =
    useState<JobFormState>(
      emptyJobForm
    );

  const [calendarTarget, setCalendarTarget] =
    useState<CalendarTarget>(
      null
    );

  const [showStartTimePicker, setShowStartTimePicker] =
    useState(false);

  const [showEndTimePicker, setShowEndTimePicker] =
    useState(false);

  const [showCategoryList, setShowCategoryList] =
    useState(false);

  const [showPartList, setShowPartList] =
    useState(false);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    init();
  }, [jobId]);

  const init = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadJob(),
        loadCategories(),
        loadParts(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD JOB
  ======================================================= */

  const loadJob = async () => {
    try {
      const jobData =
        await getJobById({
          id: Number(jobId),
        });

      if (!jobData) {
        setJob(null);
        setTicket(null);
        setCustomer(null);
        return;
      }

      setJob(jobData);

      syncFormFromJob(
        jobData
      );

      if (jobData.ticketId) {
        await loadTicketAndCustomer(
          jobData.ticketId
        );
      } else {
        setTicket(null);
        setCustomer(null);
      }
    } catch (error) {
      console.error(
        "Error loading job:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load this job."
      );

      setJob(null);
      setTicket(null);
      setCustomer(null);
    }
  };

  /* =======================================================
     LOAD CATEGORIES
  ======================================================= */

  const loadCategories =
    async () => {
      try {
        const data =
          await getAllCategories();

        setCategories(
          data || []
        );
      } catch (error) {
        console.error(
          "Error loading categories:",
          error
        );

        setCategories([]);
      }
    };

  /* =======================================================
     LOAD PARTS
  ======================================================= */

  const loadParts =
    async () => {
      try {
        const data =
          await getAllParts();

        setParts(
          data || []
        );
      } catch (error) {
        console.error(
          "Error loading parts:",
          error
        );

        setParts([]);
      }
    };

  /* =======================================================
     LOAD TICKET + CUSTOMER
  ======================================================= */

  const loadTicketAndCustomer =
    async (
      ticketId: number
    ) => {
      try {
        const ticketData =
          await getTicketById({
            id: Number(
              ticketId
            ),
          });

        if (!ticketData) {
          setTicket(null);
          setCustomer(null);
          return;
        }

        setTicket(
          ticketData
        );

        if (
          ticketData.customerId
        ) {
          try {
            const customerData =
              await getCustomerById(
                Number(
                  ticketData.customerId
                )
              );

            setCustomer(
              customerData ||
                null
            );
          } catch (
            customerError
          ) {
            console.error(
              "Error loading customer:",
              customerError
            );

            setCustomer(null);
          }
        } else {
          setCustomer(null);
        }
      } catch (error) {
        console.error(
          "Error loading ticket:",
          error
        );

        setTicket(null);
        setCustomer(null);
      }
    };

  /* =======================================================
     FORM SYNC
  ======================================================= */

  const syncFormFromJob =
    (jobData: Job) => {
      setJobForm({
        priority:
          jobData.priority ||
          "NORMAL",

        expectedDate:
          jobData.expectedDate ||
          "",

        startingDateTime:
          jobData.startingDateTime ||
          "",

        endingDateTime:
          jobData.endingDateTime ||
          "",

        jobDescription:
          jobData.jobDescription ||
          "",

        status:
          jobData.status ||
          "PENDING",

        employeeStatus:
          jobData.employeeStatus ||
          "",

        categoryId:
          jobData.categoryId ??
          null,

        partId:
          jobData.partId ??
          null,
      });
    };

  /* =======================================================
     DERIVED STATE
  ======================================================= */

  const isClosed =
    job?.status?.toUpperCase() ===
    "CLOSED";

  const isCompleted =
    job?.status?.toUpperCase() ===
    "COMPLETED";

  const isInProgress =
    job?.status?.toUpperCase() ===
    "IN_PROGRESS";

  const isUnassigned =
    job !== null &&
    (
      job.userId === null ||
      job.userId === undefined ||
      Number(job.userId) === 0 ||
      Number.isNaN(
        Number(job.userId)
      )
    );

  const isOwnJob =
    job !== null &&
    !isUnassigned &&
    Number(job.userId) ===
      Number(currentUserId);

  const canEdit =
    job !== null &&
    !isClosed &&
    isOwnJob;

  const selectedCategory =
    useMemo(() => {
      if (!jobForm.categoryId) {
        return null;
      }

      return (
        categories.find(
          (category) =>
            Number(
              category.id
            ) ===
            Number(
              jobForm.categoryId
            )
        ) || null
      );
    }, [
      categories,
      jobForm.categoryId,
    ]);

  const selectedPart =
    useMemo(() => {
      if (!jobForm.partId) {
        return null;
      }

      return (
        parts.find(
          (part) =>
            Number(part.id) ===
            Number(
              jobForm.partId
            )
        ) || null
      );
    }, [
      parts,
      jobForm.partId,
    ]);

  const categoryParts =
    useMemo(() => {
      if (!jobForm.categoryId) {
        return [];
      }

      return parts.filter(
        (part) =>
          Number(
            part.categoryId
          ) ===
          Number(
            jobForm.categoryId
          )
      );
    }, [
      parts,
      jobForm.categoryId,
    ]);

  /* =======================================================
     TAKE JOB
  ======================================================= */

  const handleTakeJob =
    async () => {
      if (!job || taking) {
        return;
      }

      if (!isUnassigned) {
        Alert.alert(
          "Already taken",
          "This job has already been assigned to a technician."
        );

        return;
      }

      setTaking(true);

      try {
        const updated =
          await updateJob({
            id: job.id,
            userId:
              currentUserId,
            updatedBy:
              currentUserName ||
              String(
                currentUserId
              ),
          });

        setJob(
          (current) =>
            current
              ? {
                  ...current,
                  ...updated,
                  userId:
                    currentUserId,
                }
              : current
        );

        Alert.alert(
          "Job Taken",
          "This job is now assigned to you."
        );
      } catch (error) {
        console.error(
          "Take job error:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to take this job. It may have already been taken."
        );

        await loadJob();
      } finally {
        setTaking(false);
      }
    };

  /* =======================================================
     START JOB
  ======================================================= */

  const handleStartJob =
    () => {
      if (!job) {
        return;
      }

      if (isClosed) {
        Alert.alert(
          "Locked",
          "This job is closed and locked."
        );

        return;
      }

      if (isUnassigned) {
        Alert.alert(
          "Take Job First",
          "Take this job before starting it."
        );

        return;
      }

      if (!isOwnJob) {
        Alert.alert(
          "Not Your Job",
          "You cannot start another technician's job."
        );

        return;
      }

      if (isInProgress) {
        return;
      }

      if (isCompleted) {
        Alert.alert(
          "Completed",
          "This job has already been completed."
        );

        return;
      }

      Alert.alert(
        "Start Job",
        "Do you want to start this job now?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Start Job",
            onPress:
              performStartJob,
          },
        ]
      );
    };

  const performStartJob =
    async () => {
      if (!job) {
        return;
      }

      setStartingJob(true);

      try {
        const startDateTime =
          getCurrentLocalDateTime();

        const updated =
          await updateJob({
            id: job.id,

            userId:
              job.userId ??
              currentUserId,

            startingDateTime:
              startDateTime,

            status:
              "IN_PROGRESS",

            employeeStatus:
              "WORKING",

            updatedBy:
              currentUserName ||
              String(
                currentUserId
              ),
          });

        const mergedJob =
          {
            ...job,
            ...updated,

            userId:
              updated?.userId ??
              job.userId ??
              currentUserId,

            startingDateTime:
              updated?.startingDateTime ??
              startDateTime,

            status:
              updated?.status ??
              "IN_PROGRESS",

            employeeStatus:
              updated?.employeeStatus ??
              "WORKING",
          };

        setJob(
          mergedJob
        );

        syncFormFromJob(
          mergedJob
        );

        Alert.alert(
          "Job Started",
          "The job has been started successfully."
        );
      } catch (error) {
        console.error(
          "Start job error:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to start the job."
        );
      } finally {
        setStartingJob(false);
      }
    };

  /* =======================================================
     END JOB
  ======================================================= */

  const handleEndJob =
    () => {
      if (!job) {
        return;
      }

      if (isClosed) {
        Alert.alert(
          "Locked",
          "This job is closed and locked."
        );

        return;
      }

      if (!isOwnJob) {
        Alert.alert(
          "Not Your Job",
          "You cannot end another technician's job."
        );

        return;
      }

      if (!isInProgress) {
        Alert.alert(
          "Job Not Started",
          "Start the job before ending it."
        );

        return;
      }

      Alert.alert(
        "End Job",
        "Do you want to mark this job as completed?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "End Job",
            onPress:
              performEndJob,
          },
        ]
      );
    };

  const performEndJob =
    async () => {
      if (!job) {
        return;
      }

      setEndingJob(true);

      try {
        const endingDateTime =
          getCurrentLocalDateTime();

        const updated =
          await updateJob({
            id: job.id,

            // IMPORTANT:
            // Keep the technician assigned when closing the job.
            // Never send null/undefined for userId here.
            userId:
              job.userId ??
              currentUserId,

            endingDateTime:
              endingDateTime,

            // A completed technician work session closes the job.
            status:
              "CLOSED",

            // Employee/technician work status remains completed.
            employeeStatus:
              "COMPLETED",

            updatedBy:
              currentUserName ||
              String(
                currentUserId
              ),
          });

        const mergedJob =
          {
            ...job,
            ...updated,

            endingDateTime:
              updated?.endingDateTime ??
              endingDateTime,

            // Keep the job CLOSED even if the backend response
            // does not return the updated status immediately.
            status:
              updated?.status ??
              "CLOSED",

            // The technician remains assigned to the job.
            userId:
              updated?.userId ??
              job.userId ??
              currentUserId,

            employeeStatus:
              updated?.employeeStatus ??
              "COMPLETED",
          };

        setJob(
          mergedJob
        );

        syncFormFromJob(
          mergedJob
        );

        Alert.alert(
          "Job Closed",
          "The job has been completed and closed successfully. The assigned technician remains linked to this job.",
          [
            {
              text: "OK",
              onPress: () => {
                if (
                  goToInvoiceCreate
                ) {
                  Alert.alert(
                    "Create Invoice",
                    "Do you want to create an invoice for this completed job?",
                    [
                      {
                        text: "Not Now",
                        style:
                          "cancel",
                      },
                      {
                        text: "Create Invoice",
                        onPress:
                          () =>
                            goToInvoiceCreate(
                              job.id
                            ),
                      },
                    ]
                  );
                }
              },
            },
          ]
        );
      } catch (error) {
        console.error(
          "End job error:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to complete the job."
        );
      } finally {
        setEndingJob(false);
      }
    };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleStartEditJob =
    () => {
      if (!canEdit || !job) {
        return;
      }

      syncFormFromJob(
        job
      );

      setIsEditingJob(
        true
      );
    };

  const handleCancelEditJob =
    () => {
      if (job) {
        syncFormFromJob(
          job
        );
      }

      closeDatePickers();

      setShowCategoryList(
        false
      );

      setShowPartList(
        false
      );

      setIsEditingJob(
        false
      );
    };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSaveJob =
    async () => {
      if (!job) {
        return;
      }

      if (isClosed) {
        Alert.alert(
          "Locked",
          "This job is closed and locked."
        );

        return;
      }

      if (isUnassigned) {
        Alert.alert(
          "Take Job First",
          "Take this job before updating it."
        );

        return;
      }

      if (!isOwnJob) {
        Alert.alert(
          "Not Your Job",
          "You cannot edit another technician's job."
        );

        return;
      }

      if (!jobForm.status.trim()) {
        Alert.alert(
          "Required",
          "Status is required."
        );

        return;
      }

      if (
        jobForm.startingDateTime &&
        jobForm.endingDateTime
      ) {
        const start =
          new Date(
            jobForm.startingDateTime
          ).getTime();

        const end =
          new Date(
            jobForm.endingDateTime
          ).getTime();

        if (
          !Number.isNaN(
            start
          ) &&
          !Number.isNaN(
            end
          ) &&
          end < start
        ) {
          Alert.alert(
            "Invalid Time",
            "Ending date/time cannot be before starting date/time."
          );

          return;
        }
      }

      setSaving(true);

      try {
        const updated =
          await updateJob({
            id: job.id,

            // IMPORTANT:
            // Editing a job must never remove its assigned technician.
            userId:
              job.userId ??
              currentUserId,

            priority:
              jobForm.priority.trim() ||
              "NORMAL",

            expectedDate:
              jobForm.expectedDate.trim() ||
              null,

            startingDateTime:
              jobForm.startingDateTime.trim() ||
              null,

            endingDateTime:
              jobForm.endingDateTime.trim() ||
              null,

            jobDescription:
              jobForm.jobDescription.trim() ||
              null,

            status:
              jobForm.status.trim(),

            employeeStatus:
              jobForm.employeeStatus.trim() ||
              null,

            categoryId:
              jobForm.categoryId,

            partId:
              jobForm.partId,

            updatedBy:
              currentUserName ||
              String(
                currentUserId
              ),
          });

        const mergedJob =
          updated
            ? {
                ...job,
                ...updated,

                // Never allow a null userId from an update response
                // to remove the existing technician assignment.
                userId:
                  updated?.userId ??
                  job.userId ??
                  currentUserId,
              }
            : {
                ...job,

                userId:
                  job.userId ??
                  currentUserId,

                priority:
                  jobForm.priority,

                expectedDate:
                  jobForm.expectedDate ||
                  null,

                startingDateTime:
                  jobForm.startingDateTime ||
                  null,

                endingDateTime:
                  jobForm.endingDateTime ||
                  null,

                jobDescription:
                  jobForm.jobDescription ||
                  null,

                status:
                  jobForm.status,

                employeeStatus:
                  jobForm.employeeStatus ||
                  null,

                categoryId:
                  jobForm.categoryId,

                partId:
                  jobForm.partId,
              };

        setJob(
          mergedJob
        );

        syncFormFromJob(
          mergedJob
        );

        setIsEditingJob(
          false
        );

        closeDatePickers();

        setShowCategoryList(
          false
        );

        setShowPartList(
          false
        );

        Alert.alert(
          "Saved",
          "Job updated successfully."
        );
      } catch (error) {
        console.error(
          "Save job error:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to update job."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     CATEGORY
  ======================================================= */

  const handleCategorySelect =
    (
      category: Category
    ) => {
      setJobForm(
        (current) => ({
          ...current,

          categoryId:
            category.id,

          partId: null,
        })
      );

      setShowCategoryList(
        false
      );

      setShowPartList(
        true
      );
    };

  /* =======================================================
     PART
  ======================================================= */

  const handlePartSelect =
    (part: Part) => {
      setJobForm(
        (current) => ({
          ...current,

          partId:
            part.id,

          categoryId:
            part.categoryId,
        })
      );

      setShowPartList(
        false
      );
    };

  /* =======================================================
     DATE HELPERS
  ======================================================= */

  const parseDateValue =
    (
      value?: string | null
    ) => {
      if (!value) {
        return new Date();
      }

      const parsed =
        new Date(value);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return new Date();
      }

      return parsed;
    };

  const parseLocalDateOnly =
    (
      value?: string | null
    ) => {
      if (!value) {
        return new Date();
      }

      const parts =
        value.split("-");

      if (
        parts.length ===
        3
      ) {
        const year =
          Number(parts[0]);

        const month =
          Number(parts[1]) - 1;

        const day =
          Number(parts[2]);

        if (
          !Number.isNaN(
            year
          ) &&
          !Number.isNaN(
            month
          ) &&
          !Number.isNaN(
            day
          )
        ) {
          return new Date(
            year,
            month,
            day
          );
        }
      }

      return parseDateValue(
        value
      );
    };

  const getCurrentLocalDateTime =
    () => {
      const now =
        new Date();

      const pad = (
        value: number
      ) =>
        String(
          value
        ).padStart(
          2,
          "0"
        );

      return `${now.getFullYear()}-${pad(
        now.getMonth() + 1
      )}-${pad(
        now.getDate()
      )}T${pad(
        now.getHours()
      )}:${pad(
        now.getMinutes()
      )}:${pad(
        now.getSeconds()
      )}`;
    };

  const formatDateTimeForApi =
    (date: Date) => {
      const pad = (
        value: number
      ) =>
        String(
          value
        ).padStart(
          2,
          "0"
        );

      return `${date.getFullYear()}-${pad(
        date.getMonth() + 1
      )}-${pad(
        date.getDate()
      )}T${pad(
        date.getHours()
      )}:${pad(
        date.getMinutes()
      )}:${pad(
        date.getSeconds()
      )}`;
    };

  const formatDateForApi =
    (date: Date) => {
      const pad = (
        value: number
      ) =>
        String(
          value
        ).padStart(
          2,
          "0"
        );

      return `${date.getFullYear()}-${pad(
        date.getMonth() + 1
      )}-${pad(
        date.getDate()
      )}`;
    };

  const formatDate =
    (
      value?: string | null
    ) => {
      if (!value) {
        return "Not scheduled";
      }

      const parsed =
        value.length === 10
          ? parseLocalDateOnly(
              value
            )
          : new Date(value);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return value;
      }

      return parsed.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

  const formatDateTime =
    (
      value?: string | null
    ) => {
      if (!value) {
        return "Not recorded";
      }

      const parsed =
        new Date(value);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return value;
      }

      return parsed.toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    };

  /* =======================================================
     TIME HELPERS
  ======================================================= */

  const getTimeFromDateTime =
    (
      value?: string | null
    ) => {
      if (!value) {
        return "";
      }

      const parsed =
        new Date(value);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return "";
      }

      const hours =
        String(
          parsed.getHours()
        ).padStart(
          2,
          "0"
        );

      const minutes =
        String(
          parsed.getMinutes()
        ).padStart(
          2,
          "0"
        );

      return `${hours}:${minutes}`;
    };

  const updateTimeValue =
    (
      value: string,
      type:
        | "start"
        | "end"
    ) => {
      const cleaned =
        value.replace(
          /[^0-9:]/g,
          ""
        );

      if (
        cleaned.length >
        5
      ) {
        return;
      }

      if (
        cleaned.length ===
        5
      ) {
        const hour =
          Number(
            cleaned.substring(
              0,
              2
            )
          );

        const minute =
          Number(
            cleaned.substring(
              3,
              5
            )
          );

        if (
          cleaned[2] === ":" &&
          hour <= 23 &&
          minute <= 59
        ) {
          const baseDate =
            parseDateValue(
              type === "start"
                ? jobForm.startingDateTime
                : jobForm.endingDateTime
            );

          baseDate.setHours(
            hour
          );

          baseDate.setMinutes(
            minute
          );

          baseDate.setSeconds(
            0
          );

          const formatted =
            formatDateTimeForApi(
              baseDate
            );

          setJobForm(
            (current) => ({
              ...current,
              ...(type ===
              "start"
                ? {
                    startingDateTime:
                      formatted,
                  }
                : {
                    endingDateTime:
                      formatted,
                  }),
            })
          );
        }
      }
    };

  /* =======================================================
     DATE PICKER
  ======================================================= */

  const openCalendar =
    (
      target: CalendarTarget
    ) => {
      setShowCategoryList(
        false
      );

      setShowPartList(
        false
      );

      setCalendarTarget(
        target
      );
    };

  const closeDatePickers =
    () => {
      setCalendarTarget(
        null
      );

      setShowStartTimePicker(
        false
      );

      setShowEndTimePicker(
        false
      );
    };

  const handleCalendarSelect =
    (selectedDate: Date) => {
      if (
        calendarTarget ===
        "expected"
      ) {
        setJobForm(
          (current) => ({
            ...current,

            expectedDate:
              formatDateForApi(
                selectedDate
              ),
          })
        );
      }

      if (
        calendarTarget ===
        "start"
      ) {
        const currentDate =
          parseDateValue(
            jobForm.startingDateTime
          );

        selectedDate.setHours(
          currentDate.getHours()
        );

        selectedDate.setMinutes(
          currentDate.getMinutes()
        );

        selectedDate.setSeconds(
          0
        );

        setJobForm(
          (current) => ({
            ...current,

            startingDateTime:
              formatDateTimeForApi(
                selectedDate
              ),
          })
        );
      }

      if (
        calendarTarget ===
        "end"
      ) {
        const currentDate =
          parseDateValue(
            jobForm.endingDateTime
          );

        selectedDate.setHours(
          currentDate.getHours()
        );

        selectedDate.setMinutes(
          currentDate.getMinutes()
        );

        selectedDate.setSeconds(
          0
        );

        setJobForm(
          (current) => ({
            ...current,

            endingDateTime:
              formatDateTimeForApi(
                selectedDate
              ),
          })
        );
      }

      setCalendarTarget(
        null
      );
    };

  /* =======================================================
     TIME PICKER
  ======================================================= */

  const openTimePicker =
    (
      type:
        | "start"
        | "end"
    ) => {
      setCalendarTarget(
        null
      );

      if (
        type === "start"
      ) {
        setShowStartTimePicker(
          true
        );
      } else {
        setShowEndTimePicker(
          true
        );
      }
    };

  /* =======================================================
     STATUS
  ======================================================= */

  const getStatusColor =
    (
      status?: string | null
    ) => {
      switch (
        status?.toLowerCase()
      ) {
        case "completed":
          return "#2E8B57";

        case "in progress":
        case "in_progress":
          return "#0757A0";

        case "closed":
          return "#5B4B8A";

        case "cancelled":
          return "#D32F2F";

        case "pending":
          return "#E28B00";

        default:
          return "#777777";
      }
    };

  const formatLabel =
    (value: string) =>
      value
        .replace(
          /_/g,
          " "
        )
        .toLowerCase()
        .replace(
          /^\w/,
          (char) =>
            char.toUpperCase()
        );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <View
        style={
          jobEditStyles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#dd651b"
        />

        <Text
          style={
            jobEditStyles.loadingText
          }
        >
          Loading job...
        </Text>
      </View>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!job) {
    return (
      <View
        style={
          jobEditStyles.emptyContainer
        }
      >
        <Ionicons
          name="alert-circle-outline"
          size={60}
          color="#dd651b"
        />

        <Text
          style={
            jobEditStyles.emptyTitle
          }
        >
          Job not found
        </Text>

        <TouchableOpacity
          style={
            jobEditStyles.backButton
          }
          onPress={
            goToJobs
          }
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={
              jobEditStyles.backButtonText
            }
          >
            Back to Jobs
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusColor =
    getStatusColor(
      job.status
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View
      style={
        jobEditStyles.screen
      }
    >
      {/* CALENDAR */}

      <CalendarModal
        visible={
          calendarTarget !==
          null
        }
        initialDate={
          calendarTarget ===
          "expected"
            ? parseLocalDateOnly(
                jobForm.expectedDate
              )
            : calendarTarget ===
              "start"
            ? parseDateValue(
                jobForm.startingDateTime
              )
            : parseDateValue(
                jobForm.endingDateTime
              )
        }
        onClose={() =>
          setCalendarTarget(
            null
          )
        }
        onSelect={
          handleCalendarSelect
        }
      />

      {/* START TIME */}

      <Modal
        visible={
          showStartTimePicker
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowStartTimePicker(
            false
          )
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              "rgba(0,0,0,0.45)",
            justifyContent:
              "center",
            paddingHorizontal:
              25,
          }}
        >
          <View
            style={{
              backgroundColor:
                "#FFFFFF",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight:
                  "800",
                color:
                  "#222222",
                marginBottom:
                  5,
              }}
            >
              Starting Time
            </Text>

            <Text
              style={{
                fontSize: 12,
                color:
                  "#888888",
                marginBottom:
                  15,
              }}
            >
              Enter time using 24-hour format
            </Text>

            <TextInput
              value={getTimeFromDateTime(
                jobForm.startingDateTime
              )}
              onChangeText={(
                value
              ) =>
                updateTimeValue(
                  value,
                  "start"
                )
              }
              placeholder="HH:MM"
              placeholderTextColor="#A0A6AD"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              style={{
                borderWidth: 1,
                borderColor:
                  "#DDE2E7",
                borderRadius: 10,
                paddingHorizontal:
                  14,
                paddingVertical:
                  13,
                fontSize: 18,
                color:
                  "#333333",
                textAlign:
                  "center",
                marginBottom:
                  15,
              }}
            />

            <View
              style={{
                flexDirection:
                  "row",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setShowStartTimePicker(
                    false
                  )
                }
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor:
                    "#DDE2E7",
                  borderRadius: 9,
                  paddingVertical:
                    12,
                  alignItems:
                    "center",
                }}
              >
                <Text
                  style={{
                    color:
                      "#555555",
                    fontWeight:
                      "700",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setShowStartTimePicker(
                    false
                  )
                }
                style={{
                  flex: 1,
                  backgroundColor:
                    "#421DDB",
                  borderRadius: 9,
                  paddingVertical:
                    12,
                  alignItems:
                    "center",
                }}
              >
                <Text
                  style={{
                    color:
                      "#FFFFFF",
                    fontWeight:
                      "700",
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

     

      <Modal
        visible={
          showEndTimePicker
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowEndTimePicker(
            false
          )
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              "rgba(0,0,0,0.45)",
            justifyContent:
              "center",
            paddingHorizontal:
              25,
          }}
        >
          <View
            style={{
              backgroundColor:
                "#FFFFFF",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight:
                  "800",
                color:
                  "#222222",
                marginBottom:
                  5,
              }}
            >
              Ending Time
            </Text>

            <Text
              style={{
                fontSize: 12,
                color:
                  "#888888",
                marginBottom:
                  15,
              }}
            >
              Enter time using 24-hour format
            </Text>

            <TextInput
              value={getTimeFromDateTime(
                jobForm.endingDateTime
              )}
              onChangeText={(
                value
              ) =>
                updateTimeValue(
                  value,
                  "end"
                )
              }
              placeholder="HH:MM"
              placeholderTextColor="#A0A6AD"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              style={{
                borderWidth: 1,
                borderColor:
                  "#DDE2E7",
                borderRadius: 10,
                paddingHorizontal:
                  14,
                paddingVertical:
                  13,
                fontSize: 18,
                color:
                  "#333333",
                textAlign:
                  "center",
                marginBottom:
                  15,
              }}
            />

            <View
              style={{
                flexDirection:
                  "row",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setShowEndTimePicker(
                    false
                  )
                }
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor:
                    "#DDE2E7",
                  borderRadius: 9,
                  paddingVertical:
                    12,
                  alignItems:
                    "center",
                }}
              >
                <Text
                  style={{
                    color:
                      "#555555",
                    fontWeight:
                      "700",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setShowEndTimePicker(
                    false
                  )
                }
                style={{
                  flex: 1,
                  backgroundColor:
                    "#421DDB",
                  borderRadius: 9,
                  paddingVertical:
                    12,
                  alignItems:
                    "center",
                }}
              >
                <Text
                  style={{
                    color:
                      "#FFFFFF",
                    fontWeight:
                      "700",
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={
          jobEditStyles.header
        }
      >
        <TouchableOpacity
          style={
            jobEditStyles.headerBackButton
          }
          onPress={
            goToJobs
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={
            jobEditStyles.headerTitle
          }
        >
          Job Details
        </Text>

        <View
          style={
            jobEditStyles.headerRight
          }
        />
      </View>

      <ScrollView
        style={
          jobEditStyles.scrollView
        }
        contentContainerStyle={
          jobEditStyles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        <View
          style={
            jobEditStyles.jobHeaderCard
          }
        >
          <View>
            <Text
              style={
                jobEditStyles.jobNumberLabel
              }
            >
              Job ID
            </Text>

            <Text
              style={
                jobEditStyles.jobNumber
              }
            >
              {job.jobId ||
                `JOB-${job.id}`}
            </Text>
          </View>

          <View
            style={[
              jobEditStyles.statusBadge,
              {
                backgroundColor:
                  `${statusColor}18`,
              },
            ]}
          >
            <View
              style={[
                jobEditStyles.statusDot,
                {
                  backgroundColor:
                    statusColor,
                },
              ]}
            />

            <Text
              style={[
                jobEditStyles.statusText,
                {
                  color:
                    statusColor,
                },
              ]}
            >
              {formatLabel(
                job.status ||
                  "Pending"
              )}
            </Text>
          </View>
        </View>



        {isClosed && (
          <View
            style={
              jobEditStyles.lockedBanner
            }
          >
            <Ionicons
              name="lock-closed"
              size={16}
              color="#5B4B8A"
            />

            <Text
              style={
                jobEditStyles.lockedBannerText
              }
            >
              This job is closed and locked.
            </Text>
          </View>
        )}



        {isUnassigned && (
          <TouchableOpacity
            style={
              jobEditStyles.takeJobButton
            }
            onPress={
              handleTakeJob
            }
            disabled={taking}
          >
            {taking ? (
              <ActivityIndicator
                color="#FFFFFF"
                size="small"
              />
            ) : (
              <Ionicons
                name="hand-left-outline"
                size={18}
                color="#FFFFFF"
              />
            )}

            <Text
              style={
                jobEditStyles.takeJobButtonText
              }
            >
              {taking
                ? "Taking..."
                : "Take This Job"}
            </Text>
          </TouchableOpacity>
        )}


        {!isUnassigned &&
          isOwnJob &&
          !isClosed && (
            <View
              style={{
                marginBottom:
                  14,
                gap: 10,
              }}
            >
              {!isInProgress &&
                !isCompleted && (
                  <TouchableOpacity
                    onPress={
                      handleStartJob
                    }
                    disabled={
                      startingJob
                    }
                    style={{
                      backgroundColor:
                        startingJob
                          ? "#AEB4BA"
                          : "#0757A0",
                      borderRadius:
                        10,
                      paddingVertical:
                        14,
                      flexDirection:
                        "row",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      gap: 8,
                    }}
                  >
                    {startingJob ? (
                      <ActivityIndicator
                        color="#FFFFFF"
                      />
                    ) : (
                      <Ionicons
                        name="play-circle-outline"
                        size={
                          21
                        }
                        color="#FFFFFF"
                      />
                    )}

                    <Text
                      style={{
                        color:
                          "#FFFFFF",
                        fontSize:
                          14,
                        fontWeight:
                          "800",
                      }}
                    >
                      {startingJob
                        ? "Starting..."
                        : "Start Job"}
                    </Text>
                  </TouchableOpacity>
                )}

              {isInProgress && (
                <TouchableOpacity
                  onPress={
                    handleEndJob
                  }
                  disabled={
                    endingJob
                  }
                  style={{
                    backgroundColor:
                      endingJob
                        ? "#AEB4BA"
                        : "#2E8B57",
                    borderRadius:
                      10,
                    paddingVertical:
                      14,
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    gap: 8,
                  }}
                >
                  {endingJob ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={
                        21
                      }
                      color="#FFFFFF"
                    />
                  )}

                  <Text
                    style={{
                      color:
                        "#FFFFFF",
                      fontSize:
                        14,
                      fontWeight:
                        "800",
                    }}
                  >
                    {endingJob
                      ? "Ending..."
                      : "End Job"}
                  </Text>
                </TouchableOpacity>
              )}

              {isCompleted && (
                <View
                  style={{
                    backgroundColor:
                      "#EAF7EF",
                    borderRadius:
                      10,
                    padding: 13,
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    gap: 8,
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#2E8B57"
                  />

                  <Text
                    style={{
                      color:
                        "#2E8B57",
                      fontWeight:
                        "700",
                      fontSize:
                        13,
                    }}
                  >
                    Job completed
                  </Text>
                </View>
              )}
            </View>
          )}

    

        {!isUnassigned &&
          !isOwnJob &&
          !isClosed && (
            <View
              style={
                jobEditStyles.lockedBanner
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#777777"
              />

              <Text
                style={
                  jobEditStyles.lockedBannerText
                }
              >
                This job belongs to another technician.
              </Text>
            </View>
          )}



        <View
          style={
            jobEditStyles.card
          }
        >
          <View
            style={
              jobEditStyles.cardTitleRow
            }
          >
            <View
              style={
                jobEditStyles.iconContainer
              }
            >
              <Ionicons
                name="pricetag-outline"
                size={20}
                color="#421DDB"
              />
            </View>

            <Text
              style={
                jobEditStyles.cardTitle
              }
            >
              Ticket Details
            </Text>
          </View>

          {ticket ? (
            <>
              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Ticket
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {ticket.ticketId ||
                    `TCK-${ticket.id}`}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Note
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {ticket.ticketNote ||
                    "No notes available."}
                </Text>
              </View>
            </>
          ) : (
            <Text
              style={
                jobEditStyles.detailValue
              }
            >
              No ticket linked to this job.
            </Text>
          )}
        </View>

  

        <View
          style={
            jobEditStyles.card
          }
        >
          <View
            style={
              jobEditStyles.cardTitleRow
            }
          >
            <View
              style={
                jobEditStyles.iconContainer
              }
            >
              <Ionicons
                name="person-outline"
                size={20}
                color="#421DDB"
              />
            </View>

            <Text
              style={
                jobEditStyles.cardTitle
              }
            >
              Customer Details
            </Text>
          </View>

          {[
            [
              "Customer",
              customer?.name,
            ],
            [
              "Phone",
              customer?.phone,
            ],
            [
              "Address",
              customer?.address,
            ],
            [
              "Pincode",
              customer?.pincode,
            ],
          ].map(
            ([label, value]) => (
              <View
                key={label}
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  {label}
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {value ||
                    "Not available"}
                </Text>
              </View>
            )
          )}
        </View>


        <View
          style={
            jobEditStyles.card
          }
        >
          <View
            style={{
              flexDirection:
                "row",
              alignItems:
                "center",
              justifyContent:
                "space-between",
            }}
          >
            <View
              style={
                jobEditStyles.cardTitleRow
              }
            >
              <View
                style={
                  jobEditStyles.iconContainer
                }
              >
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color="#421DDB"
                />
              </View>

              <Text
                style={
                  jobEditStyles.cardTitle
                }
              >
                Job Information
              </Text>
            </View>

            {canEdit &&
              !isEditingJob && (
                <TouchableOpacity
                  onPress={
                    handleStartEditJob
                  }
                >
                  <Text
                    style={{
                      color:
                        "#421DDB",
                      fontWeight:
                        "700",
                      fontSize:
                        13,
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
          </View>

      

          <View
            style={
              jobEditStyles.detailRow
            }
          >
            <Text
              style={
                jobEditStyles.detailLabel
              }
            >
              Title
            </Text>

            <Text
              style={
                jobEditStyles.detailValue
              }
            >
              {job.jobTitle ||
                "Not available"}
            </Text>
          </View>



          {!isEditingJob && (
            <>
              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Priority
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {formatLabel(
                    job.priority ||
                      "NORMAL"
                  )}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Expected Date
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {formatDate(
                    job.expectedDate
                  )}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Start Time
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {formatDateTime(
                    job.startingDateTime
                  )}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  End Time
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {formatDateTime(
                    job.endingDateTime
                  )}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Category
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {categories.find(
                    (category) =>
                      Number(
                        category.id
                      ) ===
                      Number(
                        job.categoryId
                      )
                  )?.name ||
                    "Not selected"}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Part
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {parts.find(
                    (part) =>
                      Number(
                        part.id
                      ) ===
                      Number(
                        job.partId
                      )
                  )?.name ||
                    "No part selected"}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Employee Status
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {job.employeeStatus
                    ? formatLabel(
                        job.employeeStatus
                      )
                    : "Not available"}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Description
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {job.jobDescription ||
                    "No description available."}
                </Text>
              </View>

              <View
                style={
                  jobEditStyles.detailRow
                }
              >
                <Text
                  style={
                    jobEditStyles.detailLabel
                  }
                >
                  Status
                </Text>

                <Text
                  style={
                    jobEditStyles.detailValue
                  }
                >
                  {formatLabel(
                    job.status ||
                      "PENDING"
                  )}
                </Text>
              </View>

              {!canEdit && (
                <Text
                  style={{
                    marginTop:
                      10,
                    fontSize:
                      12,
                    color:
                      "#999999",
                  }}
                >
                  {isClosed
                    ? "This job is closed and locked."
                    : isUnassigned
                    ? "Take this job to edit it."
                    : "You can't edit another technician's job."}
                </Text>
              )}
            </>
          )}

          {/* EDIT FORM */}
          {isEditingJob && (
            <>
          

              <Text
                style={[
                  jobEditStyles.inputLabel,
                  {
                    marginTop:
                      10,
                  },
                ]}
              >
                Priority
              </Text>

              <View
                style={{
                  flexDirection:
                    "row",
                  flexWrap:
                    "wrap",
                  gap: 8,
                  marginBottom:
                    14,
                }}
              >
                {PRIORITY_OPTIONS.map(
                  (
                    priority
                  ) => {
                    const selected =
                      jobForm.priority ===
                      priority;

                    return (
                      <TouchableOpacity
                        key={
                          priority
                        }
                        onPress={() =>
                          setJobForm(
                            (
                              current
                            ) => ({
                              ...current,
                              priority,
                            })
                          )
                        }
                        style={{
                          paddingHorizontal:
                            12,
                          paddingVertical:
                            8,
                          borderRadius:
                            20,
                          borderWidth:
                            1,
                          borderColor:
                            selected
                              ? "#421DDB"
                              : "#DDE2E7",
                          backgroundColor:
                            selected
                              ? "#FFF0E8"
                              : "#FFFFFF",
                        }}
                      >
                        <Text
                          style={{
                            fontSize:
                              12,
                            fontWeight:
                              "700",
                            color:
                              selected
                                ? "#421DDB"
                                : "#666666",
                          }}
                        >
                          {formatLabel(
                            priority
                          )}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>

     

              <Text
                style={
                  jobEditStyles.inputLabel
                }
              >
                Expected Date
              </Text>

              <TouchableOpacity
                onPress={() =>
                  openCalendar(
                    "expected"
                  )
                }
                style={{
                  borderWidth:
                    1,
                  borderColor:
                    "#DDE2E7",
                  borderRadius:
                    9,
                  paddingHorizontal:
                    12,
                  paddingVertical:
                    13,
                  marginBottom:
                    14,
                  flexDirection:
                    "row",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                }}
              >
                <Text
                  style={{
                    color:
                      jobForm.expectedDate
                        ? "#333333"
                        : "#A0A6AD",
                    fontSize:
                      14,
                  }}
                >
                  {jobForm.expectedDate
                    ? formatDate(
                        jobForm.expectedDate
                      )
                    : "Select expected date"}
                </Text>

                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color="#421DDB"
                />
              </TouchableOpacity>

     

              <Text
                style={
                  jobEditStyles.inputLabel
                }
              >
                Starting Date & Time
              </Text>

              <View
                style={{
                  flexDirection:
                    "row",
                  gap: 8,
                  marginBottom:
                    14,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    openCalendar(
                      "start"
                    )
                  }
                  style={{
                    flex: 1,
                    borderWidth:
                      1,
                    borderColor:
                      "#DDE2E7",
                    borderRadius:
                      9,
                    paddingHorizontal:
                      10,
                    paddingVertical:
                      12,
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      color:
                        jobForm.startingDateTime
                          ? "#333333"
                          : "#A0A6AD",
                      fontSize:
                        12,
                    }}
                    numberOfLines={
                      1
                    }
                  >
                    {jobForm.startingDateTime
                      ? formatDate(
                          jobForm.startingDateTime
                        )
                      : "Date"}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#421DDB"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    openTimePicker(
                      "start"
                    )
                  }
                  style={{
                    flex: 1,
                    borderWidth:
                      1,
                    borderColor:
                      "#DDE2E7",
                    borderRadius:
                      9,
                    paddingHorizontal:
                      10,
                    paddingVertical:
                      12,
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      color:
                        jobForm.startingDateTime
                          ? "#333333"
                          : "#A0A6AD",
                      fontSize:
                        12,
                    }}
                  >
                    {jobForm.startingDateTime
                      ? getTimeFromDateTime(
                          jobForm.startingDateTime
                        )
                      : "Time"}
                  </Text>

                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#421DDB"
                  />
                </TouchableOpacity>
              </View>


              <Text
                style={
                  jobEditStyles.inputLabel
                }
              >
                Ending Date & Time
              </Text>

              <View
                style={{
                  flexDirection:
                    "row",
                  gap: 8,
                  marginBottom:
                    14,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    openCalendar(
                      "end"
                    )
                  }
                  style={{
                    flex: 1,
                    borderWidth:
                      1,
                    borderColor:
                      "#DDE2E7",
                    borderRadius:
                      9,
                    paddingHorizontal:
                      10,
                    paddingVertical:
                      12,
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      color:
                        jobForm.endingDateTime
                          ? "#333333"
                          : "#A0A6AD",
                      fontSize:
                        12,
                    }}
                    numberOfLines={
                      1
                    }
                  >
                    {jobForm.endingDateTime
                      ? formatDate(
                          jobForm.endingDateTime
                        )
                      : "Date"}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#421DDB"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    openTimePicker(
                      "end"
                    )
                  }
                  style={{
                    flex: 1,
                    borderWidth:
                      1,
                    borderColor:
                      "#DDE2E7",
                    borderRadius:
                      9,
                    paddingHorizontal:
                      10,
                    paddingVertical:
                      12,
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      color:
                        jobForm.endingDateTime
                          ? "#333333"
                          : "#A0A6AD",
                      fontSize:
                        12,
                    }}
                  >
                    {jobForm.endingDateTime
                      ? getTimeFromDateTime(
                          jobForm.endingDateTime
                        )
                      : "Time"}
                  </Text>

                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#421DDB"
                  />
                </TouchableOpacity>
              </View>



              <Text
                style={
                  jobEditStyles.inputLabel
                }
              >
                Category
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowPartList(
                    false
                  );

                  setCalendarTarget(
                    null
                  );

                  setShowCategoryList(
                    (current) =>
                      !current
                  );
                }}
                style={{
                  borderWidth:
                    1,
                  borderColor:
                    "#DDE2E7",
                  borderRadius:
                    9,
                  paddingHorizontal:
                    12,
                  paddingVertical:
                    13,
                  marginBottom:
                    8,
                  flexDirection:
                    "row",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                }}
              >
                <Text
                  style={{
                    color:
                      selectedCategory
                        ? "#333333"
                        : "#A0A6AD",
                    fontSize:
                      14,
                    flex: 1,
                  }}
                >
                  {selectedCategory
                    ? selectedCategory.name
                    : "Select category"}
                </Text>

                <Ionicons
                  name={
                    showCategoryList
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={19}
                  color="#777777"
                />
              </TouchableOpacity>

              {showCategoryList && (
                <View
                  style={{
                    borderWidth:
                      1,
                    borderColor:
                      "#E0E4E8",
                    borderRadius:
                      9,
                    marginBottom:
                      12,
                    overflow:
                      "hidden",
                  }}
                >
                  {categories.length ===
                  0 ? (
                    <View
                      style={{
                        padding:
                          14,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            "#888888",
                          fontSize:
                            13,
                        }}
                      >
                        No categories available.
                      </Text>
                    </View>
                  ) : (
                    categories.map(
                      (
                        category
                      ) => {
                        const selected =
                          Number(
                            jobForm.categoryId
                          ) ===
                          Number(
                            category.id
                          );

                        return (
                          <TouchableOpacity
                            key={
                              category.id
                            }
                            onPress={() =>
                              handleCategorySelect(
                                category
                              )
                            }
                            style={{
                              paddingHorizontal:
                                13,
                              paddingVertical:
                                13,
                              backgroundColor:
                                selected
                                  ? "#FFF0E8"
                                  : "#FFFFFF",
                              borderBottomWidth:
                                1,
                              borderBottomColor:
                                "#F0F1F2",
                              flexDirection:
                                "row",
                              alignItems:
                                "center",
                              justifyContent:
                                "space-between",
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  selected
                                    ? "#421DDB"
                                    : "#333333",
                                fontWeight:
                                  selected
                                    ? "700"
                                    : "500",
                                fontSize:
                                  13,
                              }}
                            >
                              {
                                category.name
                              }
                            </Text>

                            {selected && (
                              <Ionicons
                                name="checkmark-circle"
                                size={
                                  19
                                }
                                color="#421DDB"
                              />
                            )}
                          </TouchableOpacity>
                        );
                      }
                    )
                  )}
                </View>
              )}

  

              <View
                style={{
                  flexDirection:
                    "row",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  marginBottom:
                    6,
                }}
              >
                <Text
                  style={
                    jobEditStyles.inputLabel
                  }
                >
                  Part
                </Text>

                {selectedCategory && (
                  <Text
                    style={{
                      color:
                        "#888888",
                      fontSize:
                        11,
                    }}
                  >
                    {
                      categoryParts.length
                    }{" "}
                    part
                    {categoryParts.length !==
                    1
                      ? "s"
                      : ""}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                disabled={
                  !jobForm.categoryId
                }
                onPress={() =>
                  setShowPartList(
                    (current) =>
                      !current
                  )
                }
                style={{
                  borderWidth:
                    1,
                  borderColor:
                    jobForm.categoryId
                      ? "#DDE2E7"
                      : "#EEEEEE",
                  borderRadius:
                    9,
                  paddingHorizontal:
                    12,
                  paddingVertical:
                    13,
                  marginBottom:
                    8,
                  flexDirection:
                    "row",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  backgroundColor:
                    jobForm.categoryId
                      ? "#FFFFFF"
                      : "#F7F7F7",
                }}
              >
                <Text
                  style={{
                    color:
                      selectedPart
                        ? "#333333"
                        : "#A0A6AD",
                    fontSize:
                      14,
                    flex: 1,
                  }}
                >
                  {!jobForm.categoryId
                    ? "Select category first"
                    : selectedPart
                    ? `${selectedPart.name} (${selectedPart.sku})`
                    : "Select part"}
                </Text>

                <Ionicons
                  name={
                    showPartList
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={19}
                  color={
                    jobForm.categoryId
                      ? "#777777"
                      : "#CCCCCC"
                  }
                />
              </TouchableOpacity>

              {showPartList &&
                jobForm.categoryId && (
                  <View
                    style={{
                      borderWidth:
                        1,
                      borderColor:
                        "#E0E4E8",
                      borderRadius:
                        9,
                      marginBottom:
                        12,
                      overflow:
                        "hidden",
                    }}
                  >
                    {categoryParts.length ===
                    0 ? (
                      <View
                        style={{
                          padding:
                            14,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              "#888888",
                            fontSize:
                              13,
                          }}
                        >
                          No parts available for this category.
                        </Text>
                      </View>
                    ) : (
                      categoryParts.map(
                        (part) => {
                          const selected =
                            Number(
                              jobForm.partId
                            ) ===
                            Number(
                              part.id
                            );

                          return (
                            <TouchableOpacity
                              key={
                                part.id
                              }
                              onPress={() =>
                                handlePartSelect(
                                  part
                                )
                              }
                              style={{
                                paddingHorizontal:
                                  13,
                                paddingVertical:
                                  12,
                                backgroundColor:
                                  selected
                                    ? "#FFF0E8"
                                    : "#FFFFFF",
                                borderBottomWidth:
                                  1,
                                borderBottomColor:
                                  "#F0F1F2",
                                flexDirection:
                                  "row",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "space-between",
                              }}
                            >
                              <View
                                style={{
                                  flex:
                                    1,
                                  paddingRight:
                                    8,
                                }}
                              >
                                <Text
                                  style={{
                                    color:
                                      selected
                                        ? "#421DDB"
                                        : "#333333",
                                    fontSize:
                                      13,
                                    fontWeight:
                                      "700",
                                  }}
                                >
                                  {
                                    part.name
                                  }
                                </Text>

                                <Text
                                  style={{
                                    color:
                                      "#888888",
                                    fontSize:
                                      11,
                                    marginTop:
                                      3,
                                  }}
                                >
                                  SKU:{" "}
                                  {
                                    part.sku
                                  }{" "}
                                  • Stock:{" "}
                                  {
                                    part.stockQuantity
                                  }
                                </Text>
                              </View>

                              {selected && (
                                <Ionicons
                                  name="checkmark-circle"
                                  size={
                                    19
                                  }
                                  color="#421DDB"
                                />
                              )}
                            </TouchableOpacity>
                          );
                        }
                      )
                    )}
                  </View>
                )}

              {/* DESCRIPTION */}

              <Text
                style={[
                  jobEditStyles.inputLabel,
                  {
                    marginTop:
                      6,
                  },
                ]}
              >
                Job Description
              </Text>

              <TextInput
                style={
                  jobEditStyles.textArea
                }
                value={
                  jobForm.jobDescription
                }
                onChangeText={(
                  value
                ) =>
                  setJobForm(
                    (current) => ({
                      ...current,
                      jobDescription:
                        value,
                    })
                  )
                }
                placeholder="Describe the job..."
                placeholderTextColor="#A0A6AD"
                multiline
              />

              {/* STATUS */}

              <Text
                style={[
                  jobEditStyles.inputLabel,
                  {
                    marginTop:
                      14,
                  },
                ]}
              >
                Status
              </Text>

              <View
                style={{
                  flexDirection:
                    "row",
                  flexWrap:
                    "wrap",
                  gap: 8,
                  marginBottom:
                    16,
                }}
              >
                {STATUS_OPTIONS.map(
                  (status) => {
                    const selected =
                      jobForm.status ===
                      status;

                    const disabled =
                      status ===
                        "IN_PROGRESS" &&
                      !jobForm.startingDateTime;

                    return (
                      <TouchableOpacity
                        key={
                          status
                        }
                        disabled={
                          disabled
                        }
                        onPress={() =>
                          setJobForm(
                            (
                              current
                            ) => ({
                              ...current,
                              status,
                            })
                          )
                        }
                        style={{
                          paddingHorizontal:
                            12,
                          paddingVertical:
                            8,
                          borderRadius:
                            20,
                          borderWidth:
                            1,
                          borderColor:
                            selected
                              ? "#421DDB"
                              : "#DDE2E7",
                          backgroundColor:
                            selected
                              ? "#FFF0E8"
                              : disabled
                              ? "#F5F5F5"
                              : "#FFFFFF",
                          opacity:
                            disabled
                              ? 0.5
                              : 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize:
                              12,
                            fontWeight:
                              "700",
                            color:
                              selected
                                ? "#421DDB"
                                : "#666666",
                          }}
                        >
                          {formatLabel(
                            status
                          )}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>

              {/* SAVE / CANCEL */}

              <View
                style={{
                  flexDirection:
                    "row",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={
                    handleCancelEditJob
                  }
                  disabled={
                    saving
                  }
                  style={{
                    flex: 1,
                    borderWidth:
                      1,
                    borderColor:
                      "#DDE2E7",
                    borderRadius:
                      9,
                    paddingVertical:
                      12,
                    alignItems:
                      "center",
                    backgroundColor:
                      "#FFFFFF",
                  }}
                >
                  <Text
                    style={{
                      color:
                        "#555555",
                      fontWeight:
                        "700",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={
                    handleSaveJob
                  }
                  disabled={
                    saving
                  }
                  style={{
                    flex: 1,
                    borderRadius:
                      9,
                    paddingVertical:
                      12,
                    alignItems:
                      "center",
                    backgroundColor:
                      saving
                        ? "#B9BDC2"
                        : "#421DDB",
                  }}
                >
                  {saving ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={{
                        color:
                          "#FFFFFF",
                        fontWeight:
                          "700",
                      }}
                    >
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* JOB TIMELINE */}

        <View
          style={
            jobEditStyles.card
          }
        >
          <View
            style={
              jobEditStyles.cardTitleRow
            }
          >
            <View
              style={
                jobEditStyles.iconContainer
              }
            >
              <Ionicons
                name="time-outline"
                size={20}
                color="#421DDB"
              />
            </View>

            <Text
              style={
                jobEditStyles.cardTitle
              }
            >
              Job Timeline
            </Text>
          </View>

          <View
            style={{
              flexDirection:
                "row",
              alignItems:
                "center",
              marginBottom:
                14,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius:
                  5,
                backgroundColor:
                  "#421DDB",
                marginRight:
                  10,
              }}
            />

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize:
                    12,
                  color:
                    "#888888",
                }}
              >
                Expected
              </Text>

              <Text
                style={{
                  fontSize:
                    13,
                  fontWeight:
                    "700",
                  color:
                    "#333333",
                  marginTop:
                    2,
                }}
              >
                {formatDate(
                  job.expectedDate
                )}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection:
                "row",
              alignItems:
                "center",
              marginBottom:
                14,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius:
                  5,
                backgroundColor:
                  job.startingDateTime
                    ? "#0757A0"
                    : "#D5D8DB",
                marginRight:
                  10,
              }}
            />

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize:
                    12,
                  color:
                    "#888888",
                }}
              >
                Started
              </Text>

              <Text
                style={{
                  fontSize:
                    13,
                  fontWeight:
                    "700",
                  color:
                    "#333333",
                  marginTop:
                    2,
                }}
              >
                {formatDateTime(
                  job.startingDateTime
                )}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection:
                "row",
              alignItems:
                "center",
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius:
                  5,
                backgroundColor:
                  job.endingDateTime
                    ? "#2E8B57"
                    : "#D5D8DB",
                marginRight:
                  10,
              }}
            />

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize:
                    12,
                  color:
                    "#888888",
                }}
              >
                Completed
              </Text>

              <Text
                style={{
                  fontSize:
                    13,
                  fontWeight:
                    "700",
                  color:
                    "#333333",
                  marginTop:
                    2,
                }}
              >
                {formatDateTime(
                  job.endingDateTime
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* INVOICE */}

        {isCompleted &&
          goToInvoiceCreate && (
            <TouchableOpacity
              style={
                jobEditStyles.invoiceButton
              }
              onPress={() =>
                goToInvoiceCreate(
                  job.id
                )
              }
            >
              <Ionicons
                name="receipt-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  jobEditStyles.invoiceButtonText
                }
              >
                Create Invoice
              </Text>
            </TouchableOpacity>
          )}

        {/* BACK */}

        <TouchableOpacity
          style={
            jobEditStyles.bottomBackButton
          }
          onPress={
            goToJobs
          }
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#FFFFFF"
          />

          <Text
            style={
              jobEditStyles.bottomBackButtonText
            }
          >
            Back to Jobs
          </Text> 
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default JobView;