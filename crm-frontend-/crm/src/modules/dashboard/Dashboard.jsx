import { Box, Avatar } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import StatCard from "../../components/dashboard/StatCard";
import ConversionCard from "../../components/dashboard/ConversionCard";
import SalesChart from "../../components/dashboard/SalesChart";
import TeamTable from "../../components/dashboard/TeamTable";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PaymentsIcon from "@mui/icons-material/Payments";
import { fetchLeads } from "../../store/LeadSlice";

import {
  fetchDashboardSummary,
  fetchConversion,
  fetchSales,
  fetchTeam,
} from "../../store/DashboardSlice";
import { fetchDeals } from "../../store/DealSlice";
import { useMemo } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();

  /* ===========================
      GET DATA FROM REDUX STORE
  ============================ */
  const { summary, conversion, sales } = useSelector(
    (state) => state.dashboard,
  );

  const { items: leads } = useSelector((state) => state.lead);
  const { items: deals } = useSelector((state) => state.deal);
  /* ===========================
      LOAD DASHBOARD DATA
  ============================ */
  useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchDeals());
    dispatch(fetchDashboardSummary());
    dispatch(fetchConversion());
    dispatch(fetchSales());
    dispatch(fetchTeam());
  }, [dispatch]);

  const teamData = useMemo(() => {
    const ACTIVE_STAGES = ["Proposal", "Negotiation"];
    const CLOSED_WON_STAGE = "Closed Won";

    return Object.values(
      deals.reduce((acc, deal) => {
        const owner = deal.dealOwner;

        if (!acc[owner]) {
          acc[owner] = {
            employee: owner,
            active_deals: 0,
            closed_deals: 0,
            revenue: 0,
          };
        }

        const current = acc[owner];

        if (ACTIVE_STAGES.includes(deal.dealStage)) {
          current.active_deals++;
        }

        if (deal.dealStage === CLOSED_WON_STAGE) {
          current.closed_deals++;
          current.revenue += Number(deal.amount) || 0;
        }

        return acc;
      }, {}),
    );
  }, [deals]);

    
  return (
    <Box
      sx={{
        display: "flex",
        marginLeft: "40px",
        marginRight: "20px",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* ================= STAT CARDS ================= */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <StatCard
              title="Total Leads"
              // value={summary?.total_leads || 0}
              value={leads.length}
              icon={
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background:
                      "radial-gradient(circle at 30% 30%, #e8e6fb, #b39ddb)",
                  }}
                >
                  <GroupsOutlinedIcon sx={{ fontSize: 28, color: "#5e35b1" }} />
                </Avatar>
              }
              color="#6C63FF"
            />

            <StatCard
              title="Active Deals"
              value={summary?.active_deals || 0}
              icon={
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background:
                      "radial-gradient(circle at 30% 30%, #d7f7e3, #00C853)",
                  }}
                >
                  <BusinessCenterIcon sx={{ fontSize: 28, color: "#008e3c" }} />
                </Avatar>
              }
              color="#00C853"
            />

            <StatCard
              title="Closed Deals"
              value={summary?.closed_deals || 0}
              icon={
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background:
                      "radial-gradient(circle at 30% 30%, #fde0dc, #F44336)",
                  }}
                >
                  <BusinessCenterIcon sx={{ fontSize: 28, color: "#c62828" }} />
                </Avatar>
              }
              color="#F44336"
            />

            <StatCard
              title="Monthly Revenue"
              value={summary?.monthly_revenue || 0}
              icon={
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background:
                      "radial-gradient(circle at 30% 30%, #fff8e1, #FFC107)",
                  }}
                >
                  <PaymentsIcon sx={{ fontSize: 28, color: "#ff8f00" }} />
                </Avatar>
              }
              color="#FFC107"
            />
          </Box>

          {/* ================= CHARTS ================= */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <ConversionCard data={conversion} />
            
            <SalesChart data={sales} />
          </Box>

          {/* ================= TEAM TABLE ================= */}
          <TeamTable data={teamData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
