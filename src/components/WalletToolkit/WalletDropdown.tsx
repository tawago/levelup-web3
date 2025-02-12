import copy from "copy-to-clipboard";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";

import {
  ButtonBase,
  Fade,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
} from "@mui/material";
import Button from "@/components/Button";

import CopySuccessSvg from "@/assets/svgs/bridge/copy-success.svg";
import BlockSvg from "@/assets/svgs/wallet-connector/block.svg";
import CopySvg from "@/assets/svgs/wallet-connector/copy.svg";
import DisconnectSvg from "@/assets/svgs/wallet-connector/disconnect.svg";
import DownTriangleSvg from "@/assets/svgs/wallet-connector/down-triangle.svg";
import { CHAIN_ID, EXPLORER_URL } from "@/constants";
import { useRainbowContext } from "@/contexts/RainbowProvider";
import { generateExploreLink, truncateAddress } from "@/utils";

const useStyles = makeStyles<any>()((theme, { dark }) => ({
  button: {
    fontSize: "1.6rem",
    height: "3.6rem",
    padding: "0 1.2rem",
    borderRadius: "0.5rem",
    border: dark
      ? `1px solid ${(theme as any).vars.palette.primary.contrastText}`
      : "none",
    backgroundColor: dark
      ? "unset"
      : (theme as any).vars.palette.themeBackground.normal,
    color: dark ? (theme as any).vars.palette.primary.contrastText : "#473835",
    whiteSpace: "nowrap",
  },

  connectButton: {
    backgroundColor: "#FF684B",
    color: (theme as any).vars.palette.primary.contrastText,
    border: "none",
    fontSize: "1.8rem",
    fontWeight: 500,
  },
  endIcon: {
    fontSize: "1.6rem",
    marginLeft: "0.8rem",
    color: dark ? (theme as any).vars.palette.primary.contrastText : "#473835",
    willChange: "transform",
    transition: "transform .3s ease-in-out",
  },
  reverseEndIcon: {
    transform: "rotate(180deg)",
  },
  paper: {
    borderRadius: "0.5rem",
    border: dark
      ? `1px solid ${(theme as any).vars.palette.primary.contrastText}`
      : "none",
    backgroundColor: dark
      ? (theme as any).vars.palette.text.primary
      : (theme as any).vars.palette.themeBackground.normal,
    marginTop: "0.5rem",
  },
  list: {
    padding: 0,
  },
  listItem: {
    height: "4rem",
    padding: "0 1.2rem",
    gap: "0.8rem",
  },
  listItemIcon: {
    minWidth: "unset !important",
    color: dark ? (theme as any).vars.palette.primary.contrastText : "#473835",
  },

  listItemText: {
    fontSize: "1.6rem",
    cursor: "pointer",
    color: dark ? (theme as any).vars.palette.primary.contrastText : "#473835",
  },
}));

const WalletDropdown = (props) => {
  const { sx, dark } = props;
  const { classes, cx } = useStyles({ dark });
  const pathname = usePathname();

  const { walletCurrentAddress, connect, disconnect, chainId } =
    useRainbowContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCopied(false);
  };

  const viewScan = useCallback(() => {
    window.open(
      generateExploreLink(
        EXPLORER_URL[chainId === CHAIN_ID.L1 ? "L1" : "L2"],
        walletCurrentAddress,
        "address",
      ),
    );
  }, [walletCurrentAddress, chainId]);

  const copyAddress = useCallback(() => {
    copy(walletCurrentAddress as string);
    setCopied(true);
  }, [walletCurrentAddress]);

  const operations = useMemo(
    () => [
      {
        icon: BlockSvg,
        label: "Block explorer",
        action: viewScan,
      },
      {
        icon: copied ? CopySuccessSvg : CopySvg,
        label: "Copy address",
        action: copyAddress,
      },
      {
        icon: DisconnectSvg,
        label: "Disconnect",
        action: () => {
          disconnect();
          handleClose();
        },
      },
    ],
    [pathname, viewScan, copyAddress, copied, disconnect],
  );

  return (
    <>
      {chainId ? (
        <ButtonBase
          classes={{ root: classes.button }}
          sx={sx}
          onClick={handleClick}
        >
          {truncateAddress(walletCurrentAddress as string)}
          <SvgIcon
            className={cx(classes.endIcon, open && classes.reverseEndIcon)}
            component={DownTriangleSvg}
            inheritViewBox
          ></SvgIcon>
        </ButtonBase>
      ) : (
        <Button variant="contained" onClick={connect}>
          Connect Wallet
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{ paper: classes.paper, list: classes.list }}
      >
        {operations.map(({ icon, label, action }) => (
          <MenuItem
            key={label}
            classes={{ root: classes.listItem }}
            onClick={action}
          >
            <ListItemIcon classes={{ root: classes.listItemIcon }}>
              <SvgIcon
                sx={{ fontSize: "1.6rem" }}
                component={icon}
                inheritViewBox
              ></SvgIcon>
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.listItemText }}>
              {label}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default WalletDropdown;
