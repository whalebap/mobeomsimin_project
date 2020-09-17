package com.mobeom.local_currency.admin;


import com.mobeom.local_currency.join.ReportListStore;
import com.mobeom.local_currency.join.SalesVoucherUser;
import com.mobeom.local_currency.reportList.ReportList;
import com.mobeom.local_currency.reportList.ReportListRepository;
import com.mobeom.local_currency.sales.Sales;
import com.mobeom.local_currency.sales.SalesRepository;
import com.mobeom.local_currency.store.StoreRepository;
import com.mobeom.local_currency.user.RequestedUsersVO;
import com.mobeom.local_currency.user.User;
import com.mobeom.local_currency.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
interface AdminService {

    Map<String, Long> localTotalChart();

    Map<String, Long> userLocalGenderChart(String localSelect);

    Map<String, Integer> userAgeTotal(String localSelect);

    Map<String, Long> storeTypeChart();

    List<SalesVoucherUser> salesMonthChart();

    List<User> getAllUserList();

    Optional<User> findOneUser(String userId);

    Map<String, Integer> useLocalChart(String localName, LocalDate startDate, LocalDate endDate);

    Map<String, SalesVoucherUser> voucherNameChart(String voucherName, String start, String end);

    Map<String, Long> storeLocalsChart(String localSelect);

    UserPageVO getUserPage(int pageNumber);

    Map<String, Long> storeIndustryChartAll();

    SalesPageVO salesList(int pageNumber);

    Map<String, List<ReportListStore>> reportList();

    ReportListStore oneStore(Long id);

    Optional<ReportList> oneStoreReport(Long id);

    ReportList updateInitial(ReportList reportList);

    List<ReportListStore> storeSearch(String searchWord);

    Map<String, SalesVoucherUser> voucherSalesTotalChart();

    UserPageVO getSearchedUsers(String selectedOption, String searchWord);

    int getSalesCount();
    int getStoreCount();
}

@Service @AllArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final ReportListRepository reportListRepository;
    private final SalesRepository salesRepository;
    private final StoreRepository storeRepository;

    @Override
    public Map<String, Long> localTotalChart() {
        return adminRepository.localTotalChart();
    }

    @Override
    public Map<String, Long> userLocalGenderChart(String localSelect) {
        return adminRepository.userLocalGenderChart(localSelect);
    }

    @Override
    public Map<String, Integer> userAgeTotal(String localSelect) {
        return adminRepository.userAgeChart(localSelect);
    }


    @Override
    public Map<String, Long> storeTypeChart() {
        return adminRepository.storeTypeLocal();
    }

    @Override
    public List<SalesVoucherUser> salesMonthChart() {
        return adminRepository.salesMonthChart();
    }

    @Override
    public List<User> getAllUserList() {
        return userRepository.findAll(); //페이지네이션
    }

    @Override
    public Optional<User> findOneUser(String userId) {
        return userRepository.findByUserId(userId);
    }

    @Override
    public Map<String, Integer> useLocalChart(String localName, LocalDate startDate, LocalDate endDate) {

        return adminRepository.useLocalChart(localName, startDate, endDate);
    }

    @Override
    public Map<String, SalesVoucherUser> voucherNameChart(String voucherName, String start, String end) {
        return adminRepository.voucherNameChart(voucherName, start, end);
    }

    @Override
    public UserPageVO getUserPage(int pageNumber) {
        UserPageVO result = new UserPageVO();
        List<RequestedUsersVO> users = new ArrayList<>();
        Page<User> pageUserList = userRepository.findAll(PageRequest.of(pageNumber, 20));
        pageUserList.forEach(user -> {
            RequestedUsersVO newUser = new RequestedUsersVO();
            newUser.setId(user.getId());
            newUser.setUserId(user.getUserId());
            newUser.setName(user.getName());
            newUser.setBirthDate(user.getBirthDate());
            newUser.setGender(user.getGender());
            newUser.setEmail(user.getEmail());
            newUser.setJoinDate(user.getJoinDate());
            newUser.setDefaultAddr(user.getDefaultAddr());
            newUser.setOptionalAddr(user.getOptionalAddr());
            users.add(newUser);
        });
        result.setTotalUsers(pageUserList.getTotalElements());
        result.setTotalPages(pageUserList.getTotalPages());
        result.setUsers(users);
        return result;
    }

    @Override
    public Map<String, Long> storeIndustryChartAll() {
        return adminRepository.storeTypeLocal();
    }

    @Override
    public SalesPageVO salesList(int pageNumber) {
                SalesPageVO list = new SalesPageVO();
                List<SalesVoucherUser> salesList = new ArrayList<>();
                Page<Sales> pageSalesList = salesRepository.findAll(PageRequest.of(pageNumber,50));
                     pageSalesList.forEach(sales->{
                    SalesVoucherUser result = new SalesVoucherUser();
                    result.setCurrencyState(sales.getCurrencyState());
                    result.setLocalCurrencyName(sales.getLocalCurrencyVoucher().getLocalCurrencyName());
                    result.setUserId(sales.getUser().getUserId());
                    result.setUnitPrice(sales.getUnitPrice());
                    result.setSalesDate(sales.getSalesDate());
                    result.setUseDate(sales.getUseDate());
                    result.setCancelDate(sales.getCancelDate());
                    salesList.add(result);
                });

                     list.setTotalPages(pageSalesList.getTotalPages());
                     list.setSalesList(salesList);

        return list;
    }

    @Override
    public Map<String, List<ReportListStore>> reportList() {
        return adminRepository.reportList();
    }

    @Override
    public ReportListStore oneStore(Long id) {
        return adminRepository.getOneStore(id);
    }

    @Override
    public Optional<ReportList> oneStoreReport(Long id) {
        return reportListRepository.findByStoreId(id);
    }

    @Override
    public ReportList updateInitial(ReportList reportList) {
        return reportListRepository.save(reportList);
    }

    @Override
    public List<ReportListStore> storeSearch(String searchWord) {
        return adminRepository.storeSearch(searchWord);
    }


    @Override
    public Map<String, SalesVoucherUser> voucherSalesTotalChart() {
        return adminRepository.voucherSalesTotalChart();
    }

    @Override
    public UserPageVO getSearchedUsers(String selectedOption, String searchWord) {

        UserPageVO result = new UserPageVO();
        List<RequestedUsersVO> users = new ArrayList<>();
        if (selectedOption.equals("userid")) {
            Optional<User> searchedUser = userRepository.findByUserId(searchWord);
            if (searchedUser.isPresent()) {
                User user = searchedUser.get();
                RequestedUsersVO newUser = new RequestedUsersVO();
                newUser.setId(user.getId());
                newUser.setUserId(user.getUserId());
                newUser.setName(user.getName());
                newUser.setBirthDate(user.getBirthDate());
                newUser.setGender(user.getGender());
                newUser.setEmail(user.getEmail());
                newUser.setJoinDate(user.getJoinDate());
                newUser.setDefaultAddr(user.getDefaultAddr());
                newUser.setOptionalAddr(user.getOptionalAddr());
                users.add(newUser);
                result.setUsers(users);
                result.setTotalPages(1);
                result.setTotalUsers(0);
                return result;
            }
        } else {
            List<User> searchedUser = userRepository.findByUserName(searchWord);
            searchedUser.forEach(user -> {
                RequestedUsersVO newUser = new RequestedUsersVO();
                newUser.setId(user.getId());
                newUser.setUserId(user.getUserId());
                newUser.setName(user.getName());
                newUser.setBirthDate(user.getBirthDate());
                newUser.setGender(user.getGender());
                newUser.setEmail(user.getEmail());
                newUser.setJoinDate(user.getJoinDate());
                newUser.setDefaultAddr(user.getDefaultAddr());
                newUser.setOptionalAddr(user.getOptionalAddr());
                users.add(newUser);
            });
            result.setUsers(users);
            result.setTotalUsers(searchedUser.size());
            result.setTotalPages((int) Math.ceil(searchedUser.size() / 20));
            return result;
        }
        return result;
    }

    @Override
    public int getSalesCount() {
        return (int)salesRepository.count();
    }

    @Override
    public int getStoreCount() {
        return (int)storeRepository.count();
    }

    @Override
    public Map<String, Long> storeLocalsChart(String localSelect) {
        return adminRepository.storeLocalsChart(localSelect);
    }

}
