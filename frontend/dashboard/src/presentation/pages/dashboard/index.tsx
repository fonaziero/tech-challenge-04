import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TransactionSection from "../../components/transactionSection";
import { User } from "@shared/interfaces/user";
import { getStoredUser } from "@shared/utils/user";
import { Section } from "../../../types/section";
import BalanceCard from "../../components/balanceCard";
import DashboardHeader from "../../components/header";
import CardContainer from "../../components/card/container";
import SecondCardContainer from "../../components/card/secondContainer";
import TransactionHistory from "../../components/transactionalHistory";
import Sidebar from "../../components/sidebar";

export default function Dashboard() {
  const router = useNavigate();
  const [storedUser, setStoredUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>(Section.Dashboard);
  const [transactionHistoryUpdated, setTransactionHistoryUpdated] = useState(false);

  useEffect(() => {
    setStoredUser(getStoredUser(router));
  }, [router]);

  const updateUser = useCallback(() => {
    setStoredUser(getStoredUser(router));
  }, [router]);

  const handleTransactionUpdate = useCallback(() => {
    setTransactionHistoryUpdated((prev) => !prev);
    updateUser();
  }, [updateUser]);

  if (!storedUser) return null;

  return (
    <>
      <DashboardHeader activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-col min-h-screen bg-lightGreen">
        <div className="flex flex-col lg:flex-row min-h-screen lg:m-auto">
          <main className="flex-1 p-4 md:p-8 flex flex-col space-y-8">
            <div className="flex flex-col lg:flex-row lg:space-x-8 gap-y-8">
              <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
              <div className="flex-1 flex justify-between flex-col gap-y-8">
                <CardContainer className="bg-darkBlue text-white items-center md:items-start">
                  <BalanceCard user={storedUser} />
                </CardContainer>
                <SecondCardContainer>
                  <TransactionSection
                    activeSection={activeSection}
                    user={storedUser}
                    onTransactionUpdate={handleTransactionUpdate}
                    updateUser={updateUser}
                  />
                </SecondCardContainer>
              </div>
              <TransactionHistory
                user={storedUser}
                updateHistoryTrigger={transactionHistoryUpdated}
                updateUser={updateUser}
              />
            </div>
          </main>
        </div>
      </div >
    </>
  );
}
