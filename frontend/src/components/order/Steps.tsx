const Steps = ({ step1, step2, step3 }: any) => {
  return (
    <div className="flex justify-center items-center w-full  max-w-[600px] space-x-4 my-4 mx-auto">
      {/* Step 1: Login */}
      <div className={`${step1 ? "text-yellow-300" : "text-gray-300"}`}>
        <span className="ml-2 sm:text-base text-sm">Login</span>
      </div>

      {/* Step 2: Shipping */}
      {step2 && (
        <>
          {step1 && (
            <div className="sm:h-0.5 h-[1px] w-full bg-yellow-500"></div>
          )}
          <div className={`${step1 ? "text-yellow-300" : "text-gray-300"}`}>
            <span className="sm:text-base text-sm">Shipping</span>
          </div>
        </>
      )}

      {/* Step 3: Summary */}
      {step1 && step2 && (
        <div
          className={`sm:h-0.5 h-[1px] w-full ${
            step3 ? "bg-yellow-500" : "bg-gray-300"
          }`}
        ></div>
      )}
      <div className={`${step3 ? "text-yellow-300" : "text-gray-300"}`}>
        <span className="sm:text-base text-sm">Summary</span>
      </div>
    </div>
  );
};

export default Steps;
