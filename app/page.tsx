"use client";

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PlatformTabs from "@/components/PlatformTabs";
import PlatformDropdown from "@/components/PlatformDropdown";
import PlatformSelector from "@/components/PlatformSelector";
import InputForm from "@/components/InputForm";
import ResultCards from "@/components/ResultCards";
import BreakdownTable from "@/components/BreakdownTable";
import dynamic from "next/dynamic";
import ComparisonView from "@/components/ComparisonView";
import ActionButtons from "@/components/ActionButtons";
import Header from "@/components/Header";
import FeatureTabs from "@/components/FeatureTabs";
import HistoryPanel from "@/components/HistoryPanel";
import TargetMarginCalculator from "@/components/TargetMarginCalculator";
import SalesSimulation from "@/components/SalesSimulation";
import MonthlyForecast from "@/components/MonthlyForecast";
import ROICalculator from "@/components/ROICalculator";
import ScenarioCompare from "@/components/ScenarioCompare";
import AlertSystem from "@/components/AlertSystem";
import CustomPresetManager from "@/components/CustomPresetManager";
import ReportGenerator from "@/components/ReportGenerator";
import LightModeView from "@/components/LightModeView";
import FormulaGuide from "@/components/FormulaGuide";
import { saveCalculation } from "@/lib/storage";
import type { SavedCalculation, CustomPreset } from "@/lib/storage";
import toast from "react-hot-toast";

const ChartSection = dynamic(() => import("@/components/ChartSection"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm animate-pulse">
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  ),
});

import type { Platform, InputData } from "@/lib/fees";
import { FEE_PRESETS, PLATFORM_NAMES } from "@/lib/fees";
import { calculateMargin, getTrafficLightStatus } from "@/lib/calc";
import { serializeState, deserializeState } from "@/lib/share";

type FeatureTab = "main" | "target" | "simulation" | "forecast" | "roi" | "scenario" | "history" | "preset";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTab>("main");
  const [isLightMode, setIsLightMode] = useState(false);
  const [comparePlatforms, setComparePlatforms] = useState<[Platform, Platform]>(["smartstore", "coupang"]);

  // 초기 상태 설정
  const getInitialState = (): { platform: Platform | "compare"; inputData: InputData } => {
    const restored = deserializeState(searchParams);
    if (restored) {
      return { platform: restored.platform, inputData: restored.inputData };
    }

    const defaultPlatform: Platform = "smartstore";
    const defaultPreset = FEE_PRESETS[defaultPlatform];
    return {
      platform: defaultPlatform,
      inputData: {
        salePrice: 0,
        receivedShipping: 0,
        cost: 0,
        shipOut: 0,
        packaging: 0,
        adCostPerOrder: 0,
        otherVariable: 0,
        returnRate: 0,
        returnShipBack: 0,
        platformFeeRate: defaultPreset.platformFeeRate,
        paymentFeeRate: defaultPreset.paymentFeeRate,
        extraFeeRate: defaultPreset.extraFeeRate,
        shippingFeeRate: defaultPreset.shippingFeeRate,
      },
    };
  };

  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    const restored = deserializeState(searchParams);
    if (restored) {
      setState({ platform: restored.platform, inputData: restored.inputData });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlatformChange = (platform: Platform | "compare") => {
    if (platform === "compare") {
      setState((prev) => ({ ...prev, platform: "compare" }));
      return;
    }

    const preset = FEE_PRESETS[platform];
    setState((prev) => ({
      platform,
      inputData: {
        ...prev.inputData,
        baseFeeRate: preset.baseFeeRate,
        linkageFeeRate: preset.linkageFeeRate,
        shippingFeeRate: preset.shippingFeeRate,
        // 하위 호환
        platformFeeRate: preset.platformFeeRate,
        paymentFeeRate: preset.paymentFeeRate,
        extraFeeRate: preset.extraFeeRate,
      },
    }));
  };

  const handleInputChange = (field: keyof InputData, value: number | "general" | "simple") => {
    setState((prev) => ({
      ...prev,
      inputData: {
        ...prev.inputData,
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    const defaultPlatform: Platform = "smartstore";
    const defaultPreset = FEE_PRESETS[defaultPlatform];
    setState({
      platform: defaultPlatform,
      inputData: {
        salePrice: 0,
        receivedShipping: 0,
        cost: 0,
        shipOut: 0,
        packaging: 0,
        adCostPerOrder: 0,
        otherVariable: 0,
        returnRate: 0,
        returnShipBack: 0,
        platformFeeRate: defaultPreset.platformFeeRate,
        paymentFeeRate: defaultPreset.paymentFeeRate,
        extraFeeRate: defaultPreset.extraFeeRate,
        shippingFeeRate: defaultPreset.shippingFeeRate,
      },
    });
  };

  const handleSaveCalculation = () => {
    const name = prompt("계산 결과 이름을 입력하세요:");
    if (!name) return;

    saveCalculation({
      name,
      platform: state.platform === "compare" ? "smartstore" : (state.platform as Platform),
      inputData: state.inputData,
      result: {
        netPayout: currentResult.netPayout,
        netMarginRate: currentResult.netMarginRate,
      },
    });
    toast.success("계산 결과가 저장되었습니다");
  };

  const handleLoadCalculation = (calc: SavedCalculation) => {
    setState({
      platform: calc.platform,
      inputData: calc.inputData,
    });
  };

  const handleSelectPreset = (preset: CustomPreset) => {
    setState((prev) => ({
      ...prev,
      inputData: {
        ...prev.inputData,
        platformFeeRate: preset.platformFeeRate,
        paymentFeeRate: preset.paymentFeeRate,
        extraFeeRate: preset.extraFeeRate,
      },
    }));
  };

  const currentResult = useMemo(() => {
    return calculateMargin(state.inputData);
  }, [state.inputData]);

  const currentStatus = useMemo(() => {
    return getTrafficLightStatus(currentResult.netPayout, currentResult.netMarginRate);
  }, [currentResult.netPayout, currentResult.netMarginRate]);

  // 비교 모드: 두 플랫폼 계산
  const platform1Input: InputData = useMemo(() => {
    const preset = FEE_PRESETS[comparePlatforms[0]];
    return {
      ...state.inputData,
      baseFeeRate: preset.baseFeeRate,
      linkageFeeRate: preset.linkageFeeRate,
      shippingFeeRate: preset.shippingFeeRate,
      // 하위 호환
      platformFeeRate: preset.platformFeeRate,
      paymentFeeRate: preset.paymentFeeRate,
      extraFeeRate: preset.extraFeeRate,
    };
  }, [state.inputData, comparePlatforms]);

  const platform2Input: InputData = useMemo(() => {
    const preset = FEE_PRESETS[comparePlatforms[1]];
    return {
      ...state.inputData,
      baseFeeRate: preset.baseFeeRate,
      linkageFeeRate: preset.linkageFeeRate,
      shippingFeeRate: preset.shippingFeeRate,
      // 하위 호환
      platformFeeRate: preset.platformFeeRate,
      paymentFeeRate: preset.paymentFeeRate,
      extraFeeRate: preset.extraFeeRate,
    };
  }, [state.inputData, comparePlatforms]);

  const platform1Result = useMemo(() => calculateMargin(platform1Input), [platform1Input]);
  const platform2Result = useMemo(() => calculateMargin(platform2Input), [platform2Input]);

  const platform1Status = useMemo(
    () => getTrafficLightStatus(platform1Result.netPayout, platform1Result.netMarginRate),
    [platform1Result.netPayout, platform1Result.netMarginRate]
  );

  const platform2Status = useMemo(
    () => getTrafficLightStatus(platform2Result.netPayout, platform2Result.netMarginRate),
    [platform2Result.netPayout, platform2Result.netMarginRate]
  );

  useEffect(() => {
    if (state.platform !== "compare") {
      const newQuery = serializeState({
        platform: state.platform as Platform,
        inputData: state.inputData,
      });
      const currentQuery = searchParams.toString();
      if (newQuery !== currentQuery) {
        router.replace(`/?${newQuery}`, { scroll: false });
      }
    }
  }, [state, router, searchParams]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?${serializeState({
          platform: state.platform === "compare" ? "smartstore" : (state.platform as Platform),
          inputData: state.inputData,
        })}`
      : "";

  const isCompareMode = state.platform === "compare";

  return (
    <div className="min-h-screen py-2 sm:py-2 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 sm:gap-0 mb-3">
          <div className="flex-1 min-w-0">
            <Header />
          </div>
          <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className={`px-3 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-xs rounded transition-colors flex-1 sm:flex-none min-w-[80px] sm:min-w-0 ${
                isLightMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isLightMode ? "상세 모드" : "라이트 모드"}
            </button>
            <button
              onClick={handleSaveCalculation}
              className="px-3 sm:px-3 py-2 sm:py-1.5 bg-green-600 text-white text-xs sm:text-xs rounded hover:bg-green-700 transition-colors flex-1 sm:flex-none min-w-[60px] sm:min-w-0"
            >
              저장
            </button>
            <div className="flex-shrink-0">
              <ActionButtons onReset={handleReset} shareUrl={shareUrl} />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isLightMode ? (
            // 라이트 모드
            <div className="max-w-2xl mx-auto">
              <LightModeView
                platform={state.platform}
                inputData={state.inputData}
                result={currentResult}
                status={currentStatus}
                onPlatformChange={handlePlatformChange}
                onInputChange={handleInputChange}
              />
            </div>
          ) : (
            // 일반 모드
            <>
              <div className="mb-3">
                <PlatformDropdown platform={state.platform} onPlatformChange={handlePlatformChange} />
              </div>

          <div className="relative mb-3">
            <FeatureTabs activeTab={activeFeatureTab} onTabChange={setActiveFeatureTab} />
          </div>

          {activeFeatureTab === "history" && (
            <HistoryPanel
              onLoad={handleLoadCalculation}
              onClose={() => setActiveFeatureTab("main")}
            />
          )}

          {activeFeatureTab === "preset" && (
            <CustomPresetManager
              currentFees={{
                platformFeeRate: state.inputData.platformFeeRate,
                paymentFeeRate: state.inputData.paymentFeeRate,
                extraFeeRate: state.inputData.extraFeeRate,
              }}
              onSelect={handleSelectPreset}
              onClose={() => setActiveFeatureTab("main")}
            />
          )}

          {!isCompareMode && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-md"
              >
                <h2 className="text-sm font-semibold text-gray-700 mb-3">입력 정보</h2>
                <InputForm inputData={state.inputData} onInputChange={handleInputChange} />
              </motion.div>

              <div className="space-y-3">
                {activeFeatureTab === "main" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-md"
                    >
                      <h2 className="text-sm sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">계산 결과</h2>
                      <ResultCards result={currentResult} status={currentStatus} />
                    </motion.div>

                    <AlertSystem result={currentResult} status={currentStatus} />

                    <FormulaGuide />

                    <BreakdownTable result={currentResult} inputData={state.inputData} />

                    <ChartSection result={currentResult} salePrice={state.inputData.salePrice} />

                    <div ref={reportRef}>
                      <ReportGenerator
                        inputData={state.inputData}
                        result={currentResult}
                        platform={state.platform as Platform}
                        reportRef={reportRef}
                      />
                    </div>
                  </>
                )}

                {activeFeatureTab === "target" && (
                  <TargetMarginCalculator inputData={state.inputData} />
                )}

                {activeFeatureTab === "simulation" && (
                  <SalesSimulation inputData={state.inputData} />
                )}

                {activeFeatureTab === "forecast" && (
                  <MonthlyForecast inputData={state.inputData} />
                )}

                {activeFeatureTab === "roi" && (
                  <ROICalculator inputData={state.inputData} />
                )}

                {activeFeatureTab === "scenario" && (
                  <ScenarioCompare baseInputData={state.inputData} />
                )}
              </div>
            </div>
          )}

          {isCompareMode && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-md space-y-3"
                  >
                    <div>
                      <h2 className="text-sm font-semibold text-gray-700 mb-3">플랫폼 선택</h2>
                      <div className="grid grid-cols-2 gap-2">
                        <PlatformSelector
                          label="플랫폼 1"
                          value={comparePlatforms[0]}
                          exclude={comparePlatforms[1]}
                          onChange={(platform) => setComparePlatforms([platform, comparePlatforms[1]])}
                        />
                        <PlatformSelector
                          label="플랫폼 2"
                          value={comparePlatforms[1]}
                          exclude={comparePlatforms[0]}
                          onChange={(platform) => setComparePlatforms([comparePlatforms[0], platform])}
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">입력 정보</h2>
                      <InputForm inputData={state.inputData} onInputChange={handleInputChange} />
                    </div>
                  </motion.div>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-md"
                  >
                    <h2 className="text-sm sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">플랫폼 비교</h2>
                    <ComparisonView
                      platform1={comparePlatforms[0]}
                      platform2={comparePlatforms[1]}
                      platform1Result={platform1Result}
                      platform2Result={platform2Result}
                      platform1Status={platform1Status}
                      platform2Status={platform2Status}
                    />
                  </motion.div>

                  <ChartSection result={currentResult} salePrice={state.inputData.salePrice} />
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-gray-600 animate-pulse">로딩 중...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
